import { Document } from "mongoose";

export enum OtpPurpose {
    signup = "signup",
    login = "login"
}

export interface IOtp extends Document {
  identifier: string; 
  otpHash: string; 
  purpose: OtpPurpose;
  attempts: number;
  resendCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}