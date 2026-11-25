import { Body, Post, Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { log } from 'console';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {} // handles this.authService = authService automatically

    @Post('login')
    login(@Body() loginDataDto: LoginDataDto) {
        return this.authService.login(loginDataDto);
    }
    @Post('signup')
    signup(@Body() signupDataDto: SignupDataDTO) {
        return this.authService.signup(signupDataDto);
    }
}

export interface LoginDataDto {
    email: string; 
    password: string;
}
export interface SignupDataDTO {
    name: string;
    email: string;
    password: string;
}
