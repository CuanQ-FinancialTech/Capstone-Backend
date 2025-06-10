import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../user-auth/jwt-auth.guard'; // Guard JWT (bisa buat sendiri)
import { Request } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtAuthGuard) // memastikan hanya user yang login bisa akses
  @Get('balance') // GET /account/me
  async getMyAccount(@Req() req: Request) {
    const user = req.user as any; // user sudah ada karena JwtAuthGuard sudah validasi token
    return this.accountService.getAccountByUserId(user.id);
  }
}
