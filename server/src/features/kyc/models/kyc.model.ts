import mongoose, { Schema } from "mongoose";
import { IKyc, DocumentType, KycStatus } from "../types";

const kycSchema = new Schema<IKyc>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"]
    },
    documentType: {
        type: String,
        enum: Object.values(DocumentType),
        required: [true, "Document type is required"]
    },
    documentNumber: {
        type: String,
        required: [true, "Document number is required"]
    },
    bankName: {
        type: String,
        required: [true, "Bank name is required"]
    },
    ifsc: {
        type: String,
        required: [true, "IFSC code is required"]
    },
    accountNo: {
        type: String,
        required: [true, "Account number is required"]
    },
    location: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    taluk: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    idCardFront: {
        type: String,
        required: [true, "ID card front image is required"]
    },
    idCardBack: {
        type: String,
        required: [true, "ID card back image is required"]
    },
    bankPassbook: {
        type: String,
        required: [true, "Bank passbook image is required"]
    },
    kycStatus: {
        type: String,
        enum: Object.values(KycStatus),
        default: KycStatus.PENDING
    },
    approvedOn: {
        type: Date
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

kycSchema.index({ kycStatus: 1 });

export const KycModel = mongoose.model<IKyc>("Kyc", kycSchema);
