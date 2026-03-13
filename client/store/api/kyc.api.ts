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
    }),
});

export const { useGetKycStatusQuery, useSubmitKycMutation } = kycApi;
