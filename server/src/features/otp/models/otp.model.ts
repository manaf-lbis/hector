import mongoose, { Schema } from "mongoose";
import { IOtp, OtpPurpose } from "../types";

const otpSchema = new Schema<IOtp>({
    email : {
        type: String,
        required: true,
        index: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: Object.values(OtpPurpose),
        required: true,
    },
    resendedAt: {
        type: Date,
        default: Date.now
    },
    attempts: {
        type: Number,
        default: 0,
    },

    resendCount: {
        type: Number,
        default: 0,
    },

    expiresAt: {
        type: Date,
        required: true,
    },
    windowExpiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
},
    {
        timestamps: true
    }
)



otpSchema.index({ identifier: 1 });
export const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);