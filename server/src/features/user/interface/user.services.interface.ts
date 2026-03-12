import { Types } from "mongoose";
import { IUser, Roles } from "../types";

export interface IUserService {
    findByIdentifier({ identifier }: { identifier: string }): Promise<IUser | null>
    findByEmailOrPhone({ email, phone }: { email: string, phone: string }): Promise<IUser | null>
    checkUserExists({ email, phone }: { email: string, phone: string }): Promise<IUser | null>
    createUser(user: Partial<IUser>): Promise<IUser>
    updateUserToken({ userId, refreshToken }: { userId: Types.ObjectId, refreshToken: string }): Promise<IUser | null>
    getActiveUserById({ userId }: { userId: Types.ObjectId }): Promise<IUser | null>

}