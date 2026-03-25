"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.createHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS) || 10;
const createHash = async (password) => {
    const salt = await bcrypt_1.default.genSalt(SALT_ROUNDS);
    return bcrypt_1.default.hash(password, salt);
};
exports.createHash = createHash;
const compareHash = async (password, hashedPassword) => {
    return await bcrypt_1.default.compare(password, hashedPassword);
};
exports.compareHash = compareHash;
