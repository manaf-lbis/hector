"use client";

import { AppBar, Toolbar, Container, Box, IconButton, alpha } from "@mui/material";
import Logo from "../ui/Logo";
import UserProfile from "../ui/navbar/UserProfile";
import AppDrawer, { NavCategory } from "../ui/navbar/AppDrawer";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/auth.slice";
import { useState } from "react";
import { useLogoutMutation } from "@/store/api/auth.api";

import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import assignmentIndIcon from '@mui/icons-material/AssignmentInd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { keyframes } from "@mui/system";
import { Badge } from "@mui/material";

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(46, 125, 50, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
`;

const AdminNavbar = () => {
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
        router.push('/admin');
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
        },
        {
            title: 'Management',
            items: [
                { id: 3, label: 'Users', icon: PeopleIcon, action: () => router.push('/admin/users') },
                { id: 4, label: 'KYC', icon: assignmentIndIcon, action: () => router.push('/admin/kyc') },
                { id: 5, label: 'Categories', icon: CategoryIcon, action: () => router.push('/admin/categories') },
            ]
        }
    ];

    return (
        <>
            {/* SIDE COMMAND HUB TRIGGER */}
            <Box
                onClick={toggleDrawer(true)}
                sx={{
                    position: 'fixed',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: (theme) => theme.zIndex.drawer - 1,
                    width: '12px',
                    height: '80px',
                    background: alpha('#2e7d32', 0.8),
                    backdropFilter: 'blur(8px)',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: `4px 0 20px ${alpha('#2e7d32', 0.2)}`,
                    '&:hover': {
                        width: '48px',
                        background: '#2e7d32',
                        boxShadow: `8px 0 30px ${alpha('#2e7d32', 0.4)}`,
                        '& .trigger-icon': {
                            opacity: 1,
                            transform: 'translateX(0)',
                        }
                    },
                }}
            >
                <GridViewIcon 
                    className="trigger-icon"
                    sx={{ 
                        color: '#fff', 
                        fontSize: '24px',
                        opacity: 0,
                        transform: 'translateX(-20px)',
                        transition: 'all 0.3s ease 0.1s'
                    }} 
                />
            </Box>

            <AppBar position="fixed" sx={{ borderRadius: 0, top: 0 }}>
                <Container maxWidth="xl">
                    <Toolbar
                        sx={{
                            minHeight: { xs: 56, md: 64 },
                            px: { xs: 2, md: 4 },
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Logo navigateTo="/admin" />

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'action.hover' }}>
                                <Badge variant="dot" color="error">
                                    <NotificationsIcon fontSize="small" />
                                </Badge>
                            </IconButton>

                            <Box>
                                <UserProfile user={user} position="right" />
                            </Box>
                            <AppDrawer 
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                user={user}
                                categories={categories}
                                anchor="left"
                            />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default AdminNavbar;
