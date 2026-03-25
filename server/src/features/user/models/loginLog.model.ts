import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILoginLog extends Document {
    user: Types.ObjectId;
    ip: string;
    userAgent: string;
    loggedInAt: Date;
}

const loginLogSchema = new Schema<ILoginLog>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    ip: String,
    userAgent: String,
    loggedInAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const LoginLogModel = mongoose.model<ILoginLog>("LoginLog", loginLogSchema);
