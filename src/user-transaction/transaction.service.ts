import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/transaction.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) { }

  // Fungsi untuk mendapatkan transaksi berdasarkan user_id
  async getTransactionsByUserId(userId: number) {
    // Ambil transaksi berdasarkan user_id
    return this.transactionRepository.findByUserId(userId);
  }

  // Fungsi untuk membuat transaksi baru
  async createTransaction(userId: number, dto: CreateTransactionDto) {
    if (!dto.categoryId) {
      throw new BadRequestException('categoryId wajib diisi');
    }

    // lanjut proses seperti biasa
    const account = await this.transactionRepository.findAccountByUserId(userId);
    if (!account) {
      throw new NotFoundException('Account not found for this user');
    }

    const currentBalance = parseFloat(account.balance);
    const newBalance =
      dto.type.toLowerCase() === 'income'
        ? currentBalance + dto.amount
        : currentBalance - dto.amount;

    const transaction = await this.transactionRepository.createTransaction(account.account_id, dto);
    await this.transactionRepository.updateAccountBalance(account.account_id, newBalance);

    return {
      message: 'Transaksi berhasil',
      transaction,
      newBalance,
      categoryId: dto.categoryId,
    }
  }

}
