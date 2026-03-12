import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URI,
    credentials: 'include',
});