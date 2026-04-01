import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi/base.api';

export interface IKycAuditLog {
    status: string;
    actionBy: string;
    actionByName: string;
    actionByRole: string;
    reason?: string;
    createdAt: string;
}

export interface IKyc {
    _id: string;
    user: any;
    dob: string;
    documentType: string;
    documentNumber: string;
    bankName: string;
    ifsc: string;
    accountNo: string;
    idCardFront: string;
    idCardBack: string;
    bankPassbook: string;
    kycStatus: string;
    history: IKycAuditLog[];
    createdAt: string;
    updatedAt: string;
}


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
        getPendingKyc: builder.query<{ kycList: any[], total: number, counts: { [key: string]: number } }, { search?: string, status?: string } | void>({
            query: (params) => {
                const search = params?.search;
                const status = params?.status;
                let url = '/kyc/pending';
                const queryParts = [];
                if (search) queryParts.push(`search=${encodeURIComponent(search)}`);
                if (status && status !== 'all') queryParts.push(`status=${status}`);
                if (queryParts.length > 0) url += `?${queryParts.join('&')}`;
                return url;
            },
            transformResponse: (response: any) => response.data,
            providesTags: ['Kyc'],
        }),
        reviewKyc: builder.mutation<any, { kycId: string, status: string, reason?: string }>({
            query: (body) => ({
                url: '/kyc/review',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Kyc'],
        }),
        bulkReviewKyc: builder.mutation<any, { kycIds: string[], status: string, reason?: string }>({
            query: (body) => ({
                url: '/kyc/bulk-review',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Kyc'],
        }),
    }),
});

export const { 
    useGetKycStatusQuery, 
    useSubmitKycMutation, 
    useGetPrivacyPolicyQuery, 
    useGetKycConfigQuery,
    useGetPendingKycQuery,
    useReviewKycMutation,
    useBulkReviewKycMutation
} = kycApi;
