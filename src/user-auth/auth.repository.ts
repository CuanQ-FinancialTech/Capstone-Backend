import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
// import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthRepository {

    constructor(
        @Inject('DATA_SOURCE')
        private dataSource: DataSource

    ) { }

    // CREATE
    async registerUser(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Insert user dan tunggu hasilnya
    const result: any = await this.dataSource.query(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [dto.username, dto.email, hashedPassword]
    );

    // Ambil user_id yang baru dibuat
    const userId = result.insertId;

    // Insert akun baru dengan userId
    await this.dataSource.query(
        `INSERT INTO account (user_id, balance) VALUES (?, ?)`,
        [userId, 0.00]
    );

    return { result }; 
}
    // LOGIN
    async loginUser(dto: LoginDto) {
        try {
            const result = await this.dataSource.query(
                `SELECT * FROM users WHERE email = ?`,
                [dto.email]
            );

            const user = result[0];
            // console.log('User found:', user);

            if (!user) {
                throw new UnauthorizedException('Email tidak ditemukan');
            }

            const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
            if (!isPasswordMatch) {
                throw new UnauthorizedException('Password salah');
            }

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;

        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Gagal login: ' + error.message);
        }
    }

}


//     // READ (find by username)
//     async findUserByUsername(username: string): Promise<UserEntity | null> {
//         return await this.repository.findOne({ where: { username } });
//     }

//     // READ (all users)
//     async findAllUsers(): Promise<UserEntity[]> {
//         return await this.repository.find();
//     }

//     // UPDATE
//     async updateUser(id: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
//         await this.repository.update(id, updateData);
//         return await this.repository.findOneBy({ id });
//     }

//     // DELETE
//     async deleteUser(id: number): Promise<void> {
//         await this.repository.delete(id);
//     }

