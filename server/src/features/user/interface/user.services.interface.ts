import { Types } from "mongoose";
import { IUser, Roles, UserStatus } from "../types";

export interface IUserService {
    findByIdentifier({ identifier }: { identifier: string }): Promise<IUser | null>
    findByEmailOrPhone({ email, phone }: { email: string, phone: string }): Promise<IUser | null>
    checkUserExists({ email, phone }: { email: string, phone: string }): Promise<IUser | null>
    createUser(user: Partial<IUser>): Promise<IUser>
    updateUserToken({ userId, refreshToken }: { userId: Types.ObjectId, refreshToken: string }): Promise<IUser | null>
    getActiveUserById({ userId }: { userId: Types.ObjectId }): Promise<IUser | null>
    getUserById({ userId }: { userId: Types.ObjectId }): Promise<IUser | null>
    getAllUsers(page?: number, limit?: number, search?: string, status?: string): Promise<{ 
        users: IUser[], 
        total: number,
        counts: { [key: string]: number }
    }>
    recordLogin(userId: Types.ObjectId, ip?: string, userAgent?: string): Promise<void>
    getLoginLogs(userId: string, limit: number): Promise<any[]>
    updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null>
}