import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseApi/base.api";
import { LoginRequest, ResendOtpRequest, SignupRequest } from '@/types/auth.type'

export const authApi = createApi({
    reducerPath: "auth",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<any, LoginRequest>({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        signup: builder.mutation<any, SignupRequest>({
            query: (userData) => ({
                url: "auth/signup",
                method: "POST",
                body: userData,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "auth/logout",
                method: "POST",
            }),
        }),
        resendOtp: builder.mutation<any, ResendOtpRequest>({
            query: (email) => ({
                url: "auth/resend-otp",
                method: "POST",
                body: { email },
            }),
        }),
    }),
});


export const {
    useLoginMutation,
    useSignupMutation,
    useLogoutMutation,
    useResendOtpMutation
} = authApi;