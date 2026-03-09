export interface LoginRequest {
    identifier: string;
    otp: string;
}

export interface SignupRequest {
    name: string;
    email: string;
    phone: string;
}

export interface ResendOtpRequest {
    email: string;
}