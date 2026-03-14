"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { loginSuccess, logout } from "@/store/slices/auth.slice";
import { useGetMeQuery } from "@/store/api/auth.api";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    const { data: userData, isSuccess, isError, isLoading, isFetching } = useGetMeQuery(undefined, {
        skip: !isMounted,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isSuccess && userData) {
            dispatch(loginSuccess(userData.data));
        } else if (isError) {
            dispatch(logout());
        }
    }, [isSuccess, userData, isError, dispatch]);

    const authState = useMemo(() => {
        const isAuthRoute = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup');
        const isUserRoute = pathname.startsWith('/user');
        const isAdminRoute = pathname.startsWith('/admin');
        const isProtectedRoute = isUserRoute || isAdminRoute;

        return { isAuthRoute, isUserRoute, isAdminRoute, isProtectedRoute };
    }, [pathname]);

    useEffect(() => {
        if (!isMounted || isLoading || isFetching) return;

        const { isAuthRoute, isUserRoute, isAdminRoute, isProtectedRoute } = authState;

        if (!isAuthenticated) {
            if (isProtectedRoute) {
                router.replace('/?auth=login');
            }
        } else {
            if (isAuthRoute) {
                if (user?.role === 'admin') router.replace('/admin');
                else router.replace('/user');
            } else if (isUserRoute && user?.role === 'admin') {
                router.replace('/admin');
            } else if (isAdminRoute && user?.role !== 'admin') {
                router.replace('/user');
            }
        }
    }, [isAuthenticated, user, authState, router, isMounted, isLoading, isFetching]);

    const shouldRender = useMemo(() => {
        if (!isMounted) return false;
        
        if (isLoading || isFetching) return false;

        const { isProtectedRoute, isAuthRoute } = authState;

        if (isProtectedRoute && !isAuthenticated) return false;
        
        if (isAuthRoute && isAuthenticated) return false;

        return true;
    }, [isMounted, isLoading, isFetching, isAuthenticated, authState]);

    if (!shouldRender) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return <>{children}</>;
}
