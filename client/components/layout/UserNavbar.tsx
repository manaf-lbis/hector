"use client";

import { AppBar, Toolbar, Container, Box } from "@mui/material";
import Logo from "../ui/Logo";
import UserProfile from "../ui/navbar/UserProfile";
import AppDrawer, { NavCategory } from "../ui/navbar/AppDrawer";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/auth.slice";
import { useState } from "react";
import { useLogoutMutation } from "@/store/api/auth.api";

const UserNavbar = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [serverLogout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await serverLogout().unwrap();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            dispatch(logout());
            router.push('/');
        }
    };

    const handleDashboard = () => {
        router.push('/user');
    };

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const categories: NavCategory[] = [
        {
            title: 'Account',
            items: [
                { id: 1, label: 'Dashboard', icon: DashboardIcon, action: handleDashboard },
                { id: 2, label: 'Logout', icon: LogoutIcon, action: handleLogout },
            ]
        }
    ];

    return (
        <AppBar position="fixed" sx={{ borderRadius: 0, top: 0 }}>
            <Container maxWidth="xl">
                <Toolbar
                    sx={{
                        minHeight: { xs: 56, md: 64 },
                        px: { xs: 2, md: 4 },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Logo navigateTo="/user" />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box onClick={toggleDrawer(true)} sx={{ cursor: 'pointer' }}>
                            <UserProfile user={user} position="right" />
                        </Box>
                        <AppDrawer 
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                            user={user}
                            categories={categories}
                            anchor="right"
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default UserNavbar;
