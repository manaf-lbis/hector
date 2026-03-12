export interface LoginInitiateRequest {
    identifier: string;
}

export interface LoginVerifyRequest {
    identifier: string;
    otp: string;
}

export interface SignupInitiateRequest {
    name: string;
    email: string;
    phone?: string;
}

export interface SignupVerifyRequest {
    name: string;
    email: string;
    phone?: string;
    otp: string;
}

export interface SignupOtpRequest {
    email: string;
    phone: string;
}

export interface LoginOtpRequest {
    identifier: string;
}

export type OtpVerifyRequest = LoginVerifyRequest | SignupVerifyRequest;