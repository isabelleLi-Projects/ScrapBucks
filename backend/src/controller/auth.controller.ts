import { Body, Post, Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {} // handles this.authService = authService automatically

    @Post('login')
    login(@Body() loginData: loginDataDto) {
        return this.authService.login(loginData.email, loginData.password,);
    }
}

export interface loginDataDto {
    email: string; 
    password: string;
}
