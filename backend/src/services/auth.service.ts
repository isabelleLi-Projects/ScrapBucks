import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthService {
    async login(email: string, password: string) {
        if (email === 'jessica@example.com' && password === 'test-hash-1') {
            return {
                message: 'Login successful',
                user: {id: 1, displayName: 'Jessica Tan', email: 'jessica@example.com',},
            };
        }
        throw new UnauthorizedException("Email or password is invalid")
    }
}