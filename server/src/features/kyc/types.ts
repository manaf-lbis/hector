import { Document, Types } from "mongoose";

export enum DocumentType {
    AADHAR = 'aadhar',
    PAN = 'pan',
    VOTERS_ID = 'voters_id',
    DRIVING_LICENSE = 'driving_license'
}

export enum KycStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    RESUBMITTED = 'resubmitted'
}

export interface IKyc extends Document {
    user: Types.ObjectId;
    dob: Date;
    documentType: DocumentType;
    documentNumber: string;

    bankName: string;
    ifsc: string;
    accountNo: string;
    location: string;
    state: string;
    district: string;
    taluk: string;
    pincode: string;
    idCardFront: string;
    idCardBack: string;
    bankPassbook: string;
    kycStatus: KycStatus;
    approvedOn?: Date;
    approvedBy?: Types.ObjectId;
}
