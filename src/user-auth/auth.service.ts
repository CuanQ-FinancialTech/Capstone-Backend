import { Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) { }


    async registerUser(dto: RegisterDto) {
        try {
            await this.authRepository.registerUser(dto);

            return {
                error: false,
                message: 'Register berhasil',
            };
        } catch (error) {
            return {
                error: true,
                message: 'Register gagal: ' + error.message,
            };
        }
    }


    async loginUser(dto: LoginDto) {
        const user = await this.authRepository.loginUser(dto); // ini sudah validasi email & password

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        const access_token = this.jwtService.sign(payload);

        return {
            message: 'Login berhasil',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.name,
                    access_token,
                },
                
            },
        };
    }

}