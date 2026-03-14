"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const api_error_1 = __importDefault(require("../../shared/utility/api.error"));
const types_1 = require("./types");
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
            throw new api_error_1.default('user not found');
        if (user.status !== types_1.UserStatus.active)
            throw new api_error_1.default('user is not blocked');
        return user;
    }
}
exports.UserService = UserService;
