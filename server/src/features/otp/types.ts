import { Document, Types } from "mongoose";

export enum OtpPurpose {
    signup = "signup",
    login = "login"
}

export interface IOtp extends Document {
  _id: Types.ObjectId;
  email: string; 
  otpHash: string; 
  purpose: OtpPurpose;
  attempts: number;
  resendedAt: Date;
  resendCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}