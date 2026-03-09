import { Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    refreshToken?: string;
    kyc:Types.ObjectId
    createdAt?: Date;
    updatedAt?: Date;
}