import { Injectable, UnauthorizedException } from "@nestjs/common";
import { db } from "../config/database";
import { SingleUser } from "../models/userRow";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    async login(email: string, password: string) {
        const [users] = await db.execute<SingleUser[]>(
            `SELECT user_id, display_name, email, password_hash, profile_photo, rating
            FROM Users
            WHERE email=?
            LIMIT 1`, 
            [email],
        );
        if (users.length === 0) {
            throw new UnauthorizedException("Email or password is invalid")
        }

        const user = users[0];

        const isPassword = await bcrypt.compare(password, user.password_hash);

        if (!isPassword) {
            throw new UnauthorizedException("Email or password is invalid")
        }
        return {
            message: 'Login successful',
            user: {id: user.user_id, displayName: user.display_name, emai: user.email, profilePhoto: user.profile_photo, rating: user.rating},
        };
        
    }
}