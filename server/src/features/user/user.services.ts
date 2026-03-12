import { Types } from "mongoose";
import ApiError from "../../shared/utility/api.error";
import { IUserRepo } from "./interface/user.repository.interface";
import { IUserService } from "./interface/user.services.interface";
import { IUser, Roles, UserStatus } from "./types";

export class UserService implements IUserService {

    constructor(
        private _userRepo: IUserRepo
    ) { }

    async checkUserExists({ email, phone }: { email: string, phone: string }): Promise<IUser | null> {
        return await this._userRepo.findOne({
            $or: [{ email }, { phone }]
        });
    }

    async findByIdentifier({ identifier }: { identifier: string }): Promise<IUser | null> {

        return await this._userRepo.findOne({
            $or: [
                { email: identifier },
                { phone: identifier }
            ]
        });
    }

    async findByEmailOrPhone({ email, phone }: { email: string; phone: string; }): Promise<IUser | null> {

        return await this._userRepo.findOne({
            $or: [
                { email },
                { phone }
            ]
        });
    }

    async createUser(user: Partial<IUser>): Promise<IUser> {
        const createdUser = await this._userRepo.create(user);
        if (!createdUser) throw new ApiError("User creation failed");
        return createdUser
    }

    async updateUserToken({ userId, refreshToken }: { userId: Types.ObjectId; refreshToken: string; }): Promise<IUser | null> {
        return await this._userRepo.findOneAndUpdate({ _id: userId }, { refreshToken });
    }

    async getActiveUserById({ userId }: { userId: Types.ObjectId; }): Promise<IUser | null> {
        const user = await this._userRepo.findOne({ _id: userId});
        if(!user) throw new ApiError('user not found')
        if(user.status !== UserStatus.active) throw new ApiError('user is not blocked')
        return user
    }

    

    






}