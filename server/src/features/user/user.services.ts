import { Types } from "mongoose";
import ApiError from "../../shared/utility/api.error";
import { IUserRepo } from "./interface/user.repository.interface";
import { IUserService } from "./interface/user.services.interface";
import { IUser, Roles, UserStatus } from "./types";
import { LoginLogModel } from "./models/loginLog.model";

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
        const user = await this._userRepo.findOne({ _id: userId });
        if (!user) throw new ApiError('User not found');
        if (user.status === UserStatus.blocked) throw new ApiError('Your account has been blocked. Please contact support.');
        return user;
    }

    async getUserById({ userId }: { userId: Types.ObjectId }): Promise<IUser | null> {
        const user = await this._userRepo.findOne({ _id: userId });
        if (!user) throw new ApiError('User not found');
        return user;
    }

    async getAllUsers(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<{
        users: IUser[],
        total: number,
        counts: { [key: string]: number }
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { customId: searchRegex }
            ];
        }

        const [users, total, countResults] = await Promise.all([
            await this._userRepo.findAll().then(res => {

                let filtered = res;
                if (status && status !== 'all') filtered = filtered.filter(u => u.status === status);
                if (search) {
                    const regex = new RegExp(search, 'i');
                    filtered = filtered.filter(u =>
                        regex.test(u.name) ||
                        regex.test(u.email) ||
                        (u as any).customId && regex.test((u as any).customId)
                    );
                }
                return filtered.slice(skip, skip + limit);
            }),
            await this._userRepo.findAll().then(res => {
                let filtered = res;
                if (status && status !== 'all') filtered = filtered.filter(u => u.status === status);
                if (search) {
                    const regex = new RegExp(search, 'i');
                    filtered = filtered.filter(u =>
                        regex.test(u.name) ||
                        regex.test(u.email) ||
                        (u as any).customId && regex.test((u as any).customId)
                    );
                }
                return filtered.length;
            }),
            await this._userRepo.findAll().then(res => {
                let baseData = res;
                if (search) {
                    const regex = new RegExp(search, 'i');
                    baseData = baseData.filter(u =>
                        regex.test(u.name) ||
                        regex.test(u.email) ||
                        (u as any).customId && regex.test((u as any).customId)
                    );
                }
                const counts: { [key: string]: number } = { all: baseData.length };
                baseData.forEach(u => {
                    counts[u.status] = (counts[u.status] || 0) + 1;
                });
                return counts;
            })
        ]);

        return { users, total, counts: countResults };
    }

    async recordLogin(userId: Types.ObjectId, ip?: string, userAgent?: string): Promise<void> {
        await this._userRepo.update(userId, { lastLogin: new Date() } as any);
        await LoginLogModel.create({
            user: userId,
            ip,
            userAgent,
            loggedInAt: new Date()
        });
    }

    async getLoginLogs(userId: string, limit: number): Promise<any[]> {
        return await LoginLogModel.find({ user: userId })
            .sort({ loggedInAt: -1 })
            .limit(limit)
            .exec();
    }

    async updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null> {
        const user = await this._userRepo.update(new Types.ObjectId(userId), { status } as any);
        if (!user) throw new ApiError("User not found");
        return user;
    }
}