"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
const types_1 = require("./types");
const loginLog_model_1 = require("./models/loginLog.model");
class UserService {
    constructor(_userRepo) {
        this._userRepo = _userRepo;
    }
    async checkUserExists({ email, phone }) {
        return await this._userRepo.findOne({
            $or: [{ email }, { phone }]
        });
    }
    async findByIdentifier({ identifier }) {
        return await this._userRepo.findOne({
            $or: [
                { email: identifier },
                { phone: identifier }
            ]
        });
    }
    async findByEmailOrPhone({ email, phone }) {
        return await this._userRepo.findOne({
            $or: [
                { email },
                { phone }
            ]
        });
    }
    async createUser(user) {
        const createdUser = await this._userRepo.create(user);
        if (!createdUser)
            throw new api_error_1.default("User creation failed");
        return createdUser;
    }
    async updateUserToken({ userId, refreshToken }) {
        return await this._userRepo.findOneAndUpdate({ _id: userId }, { refreshToken });
    }
    async getActiveUserById({ userId }) {
        const user = await this._userRepo.findOne({ _id: userId });
        if (!user)
            throw new api_error_1.default('User not found');
        if (user.status === types_1.UserStatus.blocked)
            throw new api_error_1.default('Your account has been blocked. Please contact support.');
        return user;
    }
    async getUserById({ userId }) {
        const user = await this._userRepo.findOne({ _id: userId });
        if (!user)
            throw new api_error_1.default('User not found');
        return user;
    }
    async getAllUsers(page = 1, limit = 10, search, status) {
        const skip = (page - 1) * limit;
        const query = {};
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
                if (status && status !== 'all')
                    filtered = filtered.filter(u => u.status === status);
                if (search) {
                    const regex = new RegExp(search, 'i');
                    filtered = filtered.filter(u => regex.test(u.name) ||
                        regex.test(u.email) ||
                        u.customId && regex.test(u.customId));
                }
                return filtered.slice(skip, skip + limit);
            }),
            await this._userRepo.findAll().then(res => {
                let filtered = res;
                if (status && status !== 'all')
                    filtered = filtered.filter(u => u.status === status);
                if (search) {
                    const regex = new RegExp(search, 'i');
                    filtered = filtered.filter(u => regex.test(u.name) ||
                        regex.test(u.email) ||
                        u.customId && regex.test(u.customId));
                }
                return filtered.length;
            }),
            await this._userRepo.findAll().then(res => {
                let baseData = res;
                if (search) {
                    const regex = new RegExp(search, 'i');
                    baseData = baseData.filter(u => regex.test(u.name) ||
                        regex.test(u.email) ||
                        u.customId && regex.test(u.customId));
                }
                const counts = { all: baseData.length };
                baseData.forEach(u => {
                    counts[u.status] = (counts[u.status] || 0) + 1;
                });
                return counts;
            })
        ]);
        return { users, total, counts: countResults };
    }
    async recordLogin(userId, ip, userAgent) {
        await this._userRepo.update(userId, { lastLogin: new Date() });
        await loginLog_model_1.LoginLogModel.create({
            user: userId,
            ip,
            userAgent,
            loggedInAt: new Date()
        });
    }
    async getLoginLogs(userId, limit) {
        return await loginLog_model_1.LoginLogModel.find({ user: userId })
            .sort({ loggedInAt: -1 })
            .limit(limit)
            .exec();
    }
    async updateUserStatus(userId, status) {
        const user = await this._userRepo.update(new mongoose_1.Types.ObjectId(userId), { status });
        if (!user)
            throw new api_error_1.default("User not found");
        return user;
    }
}
exports.UserService = UserService;
