import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout } from "../../slices/auth.slice";

const baseQueryConfig = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URI,
    credentials: 'include',
});

export const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQueryConfig(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQueryConfig({ url: '/auth/refresh', method: 'POST' }, api, extraOptions);

        if (refreshResult.data) {
            result = await baseQueryConfig(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};