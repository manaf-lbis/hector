import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi/base.api';

export const userAdminApi = createApi({
    reducerPath: 'userAdminApi',
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getAllUsers: builder.query<{ users: any[], total: number, counts: { [key: string]: number } }, { page: number, limit: number, search?: string, status?: string }>({
            query: ({ page, limit, search, status }) => {
                let url = `/users/all?page=${page}&limit=${limit}`;
                if (search) url += `&search=${encodeURIComponent(search)}`;
                if (status && status !== 'all') url += `&status=${status}`;
                return url;
            },
            transformResponse: (response: any) => response.data,
            providesTags: ['User'],
        }),
        getUserDetails: builder.query<any, string>({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        getLoginLogs: builder.query<any[], { userId: string, limit: number }>({
            query: ({ userId, limit }) => `/users/logs/${userId}?limit=${limit}`,
        }),
        updateUserStatus: builder.mutation<any, { userId: string, status: string }>({
            query: ({ userId, status }) => ({
                url: `/users/${userId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'User'],
        }),
    }),
});

export const { 
    useGetAllUsersQuery, 
    useGetUserDetailsQuery,
    useGetLoginLogsQuery,
    useUpdateUserStatusMutation 
} = userAdminApi;
