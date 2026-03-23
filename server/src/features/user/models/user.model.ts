import mongoose, { Schema } from "mongoose";
import { IUser, Roles, UserStatus } from "../types";


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
    phone:{
        type : String,
        required :true,
        trim : true,
        unique :true
    },
    role:{
        type : String,
        enum : Object.values(Roles),
        required : true
    },
    refreshToken: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.active
    },
    kyc: {
        type: Schema.ObjectId,
        ref: 'Kyc'
    },
    customId: {
        type: String,
        unique: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function() {
    if (!this.customId) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        this.customId = `#${randomNum}`;
    }
});

userSchema.index({ email: 1 });
userSchema.index({ customId: 1 });

export const UserModel = mongoose.model<IUser>("User", userSchema);