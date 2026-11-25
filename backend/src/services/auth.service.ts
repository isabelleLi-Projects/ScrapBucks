import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { db } from "../config/database";
import { ExistingUser, SingleUser } from "../models/userRow";
import { LoginDataDto, SignupDataDTO } from "../controller/auth.controller";
import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2";

@Injectable()
export class AuthService {
    async login(loginDataDto: LoginDataDto) {
        const [users] = await db.execute<SingleUser[]>(
            `SELECT user_id, display_name, email, password_hash
            FROM Users
            WHERE email=?
            LIMIT 1`, 
            [loginDataDto.email],
        );
        if (users.length <= 0) {
            throw new UnauthorizedException("Email or password is invalid")
        }
        const user = users[0];
        const isPassword = await bcrypt.compare(loginDataDto.password, user.password_hash);
        if (!isPassword) {
            throw new UnauthorizedException("Email or password is invalid")
        }
        return {
            message: 'Login successful',
            user: {id: user.user_id, displayName: user.display_name, emai: user.email},
        };
    }
    async signup(signupDataDTO: SignupDataDTO) {
        const[existingUsers] = await db.execute<ExistingUser[]>(
            `SELECT user_id FROM Users WHERE email = ?`,
            [signupDataDTO.email],
        );
        if (existingUsers.length > 0) {
            throw new ConflictException("Email is already registered.");
        }
        

        const passwordHash = await bcrypt.hash(signupDataDTO.password, 10);

        const[newUser] =  await db.execute<ResultSetHeader>(
            `INSERT INTO Users 
            (display_name, email, password_hash)
            VALUES(?, ?, ?)`,
            [signupDataDTO.name, signupDataDTO.email, passwordHash]
        );
        console.log(newUser.insertId);

        return {
            message: 'Account Created Successfully',
            user: {id: newUser.insertId, displayName: signupDataDTO.name, email: signupDataDTO.email},
        };

    }
}