import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi/base.api';
import type { LoginInitiateRequest, LoginOtpRequest, OtpVerifyRequest, SignupInitiateRequest, SignupOtpRequest } from '@/types/auth.type';

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
        verifySignupOtp: builder.mutation<any, OtpVerifyRequest>({
            query: (body) => ({
                url: '/auth/signup/verify-otp',
                method: 'POST',
                body,
            }),
        }),
        verifyLoginOtp: builder.mutation<any, OtpVerifyRequest>({
            query: (body) => ({
                url: '/auth/login/verify-otp',
                method: 'POST',
                body,
            }),
        }),
        resendSignupOtp: builder.mutation<any, SignupOtpRequest>({
            query: (body) => ({
                url: '/auth/signup/resend-otp',
                method: 'POST',
                body,
            }),
        }),
        resendLoginOtp: builder.mutation<any, LoginOtpRequest>({
            query: (body) => ({
                url: '/auth/login/resend-otp',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useInitiateLoginMutation,
    useInitiateSignupMutation,
    useVerifyLoginOtpMutation,
    useVerifySignupOtpMutation,
    useResendSignupOtpMutation,
    useResendLoginOtpMutation,
} = authApi;