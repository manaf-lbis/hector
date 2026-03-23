import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth.slice';
import { authApi } from "./api/auth.api";
import { kycApi } from "./api/kyc.api";
import { userAdminApi } from "./api/userAdmin.api";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [kycApi.reducerPath]: kycApi.reducer,
        [userAdminApi.reducerPath]: userAdminApi.reducer,
        user: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, kycApi.middleware, userAdminApi.middleware),
});




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;