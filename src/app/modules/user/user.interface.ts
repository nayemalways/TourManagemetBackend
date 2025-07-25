import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUID = "GUID"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider: string;
    providerId: string;
}

export interface IUser {
    name: string;
    email: string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: boolean;
    isActive ?: IsActive;
    isVerified ?: boolean;
    role: Role;
    auths ?: IAuthProvider[]; // USER CAN ADD ALSO THERIR PASSWORD EVEN CREATE WITH GOOGLE
    bookings ?: Types.ObjectId[];
    guides ?: Types.ObjectId[];
}