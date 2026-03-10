import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi/base.api';
import type { LoginInitiateRequest, OtpVerifyRequest, ResendOtpRequest, SignupInitiateRequest } from '@/types/auth.type';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        initiateLogin: builder.mutation<any, LoginInitiateRequest>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
        initiateSignup: builder.mutation<any, SignupInitiateRequest>({
            query: (body) => ({
                url: '/auth/signup',
                method: 'POST',
                body,
            }),
        }),
        verifyOtp: builder.mutation<any, OtpVerifyRequest>({
            query: (body) => ({
                url: '/auth/verify',
                method: 'POST',
                body,
            }),
        }),
        resendOtp: builder.mutation<any, ResendOtpRequest>({
            query: (body) => ({
                url: '/auth/resend-otp',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useVerifyOtpMutation,
    useResendOtpMutation,
    useInitiateLoginMutation,
    useInitiateSignupMutation
} = authApi;