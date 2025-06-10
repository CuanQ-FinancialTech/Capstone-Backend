import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth') // Base route: /auth
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register') // POST /user/register
    async registerUser(@Body() dto: RegisterDto) {
        return await this.authService.registerUser(dto);
    }

    @Post('login') // POST /user/login
    async loginUser(@Body() dto: LoginDto) {
        return await this.authService.loginUser(dto);
    }
}
