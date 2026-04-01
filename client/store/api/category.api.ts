import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi/base.api';

export interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: { data: Category[] }) => response.data,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, FormData>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    bulkUpdateCategoryStatus: builder.mutation<any, { ids: string[], status: 'active' | 'blocked' }>({
      query: (body) => ({
        url: '/categories/bulk-status',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    bulkDeleteCategories: builder.mutation<any, { ids: string[] }>({
      query: (body) => ({
        url: '/categories/bulk',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useBulkUpdateCategoryStatusMutation,
  useBulkDeleteCategoriesMutation,
} = categoryApi;
