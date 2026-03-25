"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const api_error_1 = __importDefault(require("../utility/api.error"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Database Connected');
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        throw new api_error_1.default("Database connection failed");
    }
};
exports.connectDB = connectDB;
