
import { RowDataPacket } from "mysql2";

export interface SingleUser extends RowDataPacket { // show one row of data
    user_id: number;
    display_name: string;
    email: string;
    password_hash: string;
    profile_photo: string | null;
    rating: number;
}

export interface ExistingUser extends RowDataPacket {
    user_id: number;
    email: string;
}