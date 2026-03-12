import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth.slice';
import { authApi } from "./api/auth.api";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        user: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;