import { Types } from "mongoose";
import ApiError from "../../shared/utility/api.error";
import { IUserRepo } from "./interface/user.repository.interface";
import { IUserService } from "./interface/user.services.interface";
import { IUser, Roles, UserStatus } from "./types";
import { LoginLogModel } from "./models/loginLog.model";
import { UserModel } from "./models/user.model";

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

    async getAllUsers(page: number = 1, limit: number = 10, search?: string, status?: string, excludeId?: string): Promise<{
        users: IUser[],
        total: number,
        counts: { [key: string]: number }
    }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (excludeId) {
            query._id = { $ne: new Types.ObjectId(excludeId) };
        }

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

        // Use aggregation to perform lookup for kyc data
        const [results, total, allForCounts] = await Promise.all([
            UserModel.aggregate([
                { $match: query },
                { $sort: { createdAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'kycs',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'kyc_lookup'
                    }
                },
                {
                    $addFields: {
                        kyc: { $arrayElemAt: ['$kyc_lookup', 0] },
                        kycData: { $arrayElemAt: ['$kyc_lookup', 0] }
                    }
                },
                { $project: { kyc_lookup: 0 } }
            ]).exec(),
            UserModel.countDocuments(query).exec(),
            UserModel.aggregate([
                { $match: { ...query, status: { $exists: true } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]).exec()
        ]);

        const counts: { [key: string]: number } = { all: total };
        allForCounts.forEach((record: any) => {
            counts[record._id] = record.count;
        });

        return { users: results as IUser[], total, counts };
    }

    async recordLogin(userId: Types.ObjectId, ip?: string, userAgent?: string): Promise<void> {
        await Promise.all([
            LoginLogModel.create({
                user: userId,
                ip,
                userAgent,
                loggedInAt: new Date()
            }),
            UserModel.findByIdAndUpdate(userId, { lastLogin: new Date() })
        ]);
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

    async bulkUpdateUserStatus(userIds: string[], status: UserStatus): Promise<any> {
        return await UserModel.updateMany({ _id: { $in: userIds } }, { status }).exec();
    }
}