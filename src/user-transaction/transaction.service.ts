import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/transaction.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly configService: ConfigService
  ) { }

  async getAccount(userId: number) {
    const account = await this.transactionRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  // Fungsi untuk mendapatkan transaksi berdasarkan user_id
  async getTransactionsByUserId(userId: number) {
    // Ambil transaksi berdasarkan user_id
    return this.transactionRepository.findByUserId(userId);
  }

  // Fungsi untuk membuat transaksi baru
  async createTransaction(userId: number, text: string) {
    if (!text) {
      throw new BadRequestException('Teks tidak boleh kosong');
    }

    //Kirim teks ke API ML
    const mlApiUrl = this.configService.get<string>('ML_API_URL');
    if (!mlApiUrl) {
      throw new Error('ML_API_URL is not defined in environment variables');
    }
    const response = await axios.post(`${mlApiUrl}/classified`, { text: text });

    const result = response.data;
    //Validasi hasil dari API ML
    if (!result.predicted_type || !result.predicted_category) {
      throw new BadRequestException('Klasifikasi gagal dilakukan');
    }

    //Mapping kategori
    const categoryMap: Record<string, string> = {
      'Food & Beverage': 'FOOD & BEVERAGE',
      'Transportation': 'TRANSPORTATION',
      'Housing': 'HOUSING',
      'Health': 'HEALTH',
      'Lifestyle': 'LIFESTYLE',
      'Income': 'INCOME',
      'Others': 'OTHERS',
    };
    const mappedCategory = categoryMap[result.predicted_category] || result.predicted_category;

    //Validasi kategori
    const categoryId = await this.transactionRepository.findCategoryIdByName(mappedCategory);
    if (!categoryId) {
      throw new NotFoundException(`Kategori "${mappedCategory}" tidak ditemukan`);
    }

    // Mapping ke DTO
    const dto: CreateTransactionDto = {
      amount: result.amount || 0,
      description: result.original_text,
      type: result.predicted_type.toLowerCase(),
      category_id: categoryId,
    };

    // Cari akun berdasarkan user_id
    const account = await this.transactionRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundException('Account not found for this user');
    }

    // Saldo akun awal
    const currentBalance = parseFloat(account.balance);

    // Menghitung saldo baru
    const newBalance =
      dto.type.toLowerCase() === 'income'
        ? currentBalance + dto.amount
        : currentBalance - dto.amount;

    const transaction = await this.transactionRepository.createTransaction(account.account_id, dto);
    await this.transactionRepository.updateAccountBalance(account.account_id, newBalance);

    return {
      message: 'Transaksi berhasil diproses',
      data: {
        transaction,
        newBalance,
        previousBalance: currentBalance,
        category: result.predicted_category,
        type: dto.type,
        description: dto.description,
        amount: dto.amount,
      }
    };
  }



  // Fungsi untuk prediksi pengeluaran masa depan
  async getPrediction(accountId: number, periods: number) {
    const incomeAgg = await this.transactionRepository.getDailyIncomeSummary(accountId);
    const expenseAgg = await this.transactionRepository.getDailyExpenseSummary(accountId);

    // console.log("Hasil query expenses:", expenseAgg.map(e => e.transaction_date));


    if (!incomeAgg.length && !expenseAgg.length) {
      throw new NotFoundException('Tidak ada data income/expense dalam 10 hari terakhir');
    }

    function deduplicateByDate(data: { date: string; value: string }[]) {
      const map = new Map();
      for (const item of data) {
        if (!map.has(item.date)) {
          map.set(item.date, item);
        } else {
          console.warn("Duplikat ditemukan di tanggal:", item.date);
        }
      }
      return Array.from(map.values());
    }

    const data_income = deduplicateByDate(
      incomeAgg.map((item) => ({
        date: new Date(item.transaction_date).toISOString().split("T")[0],
        value: String(item.total_income),
      }))
    );

    const data_expenses = deduplicateByDate(
      expenseAgg.map((item) => ({
        date: new Date(item.transaction_date).toISOString().split("T")[0],
        value: String(item.total_expense),
      }))
    );


    const requestPayload = {
      data_income,
      data_expenses,
      periods
    };

    // console.log('Payload dikirim ke ML API:', JSON.stringify(requestPayload, null, 2));

    const mlApiUrl = this.configService.get<string>('ML_API_URL');
    if (!mlApiUrl) {
      throw new Error('ML_API_URL is not defined');
    }

    const response = await axios.post(`${mlApiUrl}/forecast`, requestPayload);
    const result = response.data;
    // console.log('Response dari ML API:', result);

    return {
      forecast: result.forecast
    };
  }

}


