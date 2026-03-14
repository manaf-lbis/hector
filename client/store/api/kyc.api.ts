import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi/base.api';

export const kycApi = createApi({
    reducerPath: 'kycApi',
    baseQuery,
    tagTypes: ['Kyc'],
    endpoints: (builder) => ({
        getKycStatus: builder.query<any, void>({
            query: () => '/kyc/status',
            providesTags: ['Kyc'],
        }),
        submitKyc: builder.mutation<any, any>({
            query: (body) => ({
                url: '/kyc/submit',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Kyc'],
        }),
        getPrivacyPolicy: builder.query<{ policy: string }, void>({
            query: () => '/kyc/privacy-policy',
        }),
        getKycConfig: builder.query<{ DOCUMENT_TYPES: { value: string, label: string }[], MAJOR_BANKS: string[] }, void>({
            query: () => '/kyc/config',
        }),
    }),
});

export const { useGetKycStatusQuery, useSubmitKycMutation, useGetPrivacyPolicyQuery, useGetKycConfigQuery } = kycApi;
