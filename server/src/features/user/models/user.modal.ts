import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";


const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        default: null
    },
    kyc: {
        type: Schema.ObjectId,
        ref: 'Kyc'
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1 });
export const UserModel = mongoose.model<IUser>("User", userSchema);