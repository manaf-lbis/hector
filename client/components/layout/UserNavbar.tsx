"use client";

import { AppBar, Toolbar, Container, Box } from "@mui/material";
import Logo from "../ui/Logo";
import UserProfile from "../ui/navbar/UserProfile";
import AppDrawer, { NavCategory } from "../ui/navbar/AppDrawer";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import BadgeIcon from '@mui/icons-material/Badge';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/auth.slice";
import { useState, useMemo } from "react";
import { useLogoutMutation } from "@/store/api/auth.api";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import LocationSelector from "../ui/location/LocationSelector";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Typography, IconButton, Badge } from "@mui/material";

const UserNavbar = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [serverLogout] = useLogoutMutation();
    const currentKycStatus = user?.kycStatus;
    const currentKycData = user?.kycData;

    const [locationModalOpen, setLocationModalOpen] = useState(false);

    useCurrentLocation(user);

    const locCity = user?.location?.city || "Kerala";
    const locState = user?.location?.state || "India";


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

    const handleKYC = () => {
        router.push('/user/kyc');
    };

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const categories: NavCategory[] = [
        ...(user?.role !== 'admin' ? [{
            title: 'Profile',
            items: [
                { id: 'kyc', label: 'Update KYC', icon: BadgeIcon, action: handleKYC },
            ]
        }] : []),
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 4 } }}>
                        <Logo navigateTo="/user" />

                        <Box
                            onClick={() => setLocationModalOpen(true)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                padding: { xs: '4px 8px', md: '6px 12px' },
                                borderRadius: 8,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                        >
                            <LocationOnIcon color="primary" fontSize="small" />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, fontWeight: 'bold' }}>
                                    {locState}
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.2, fontWeight: 'medium' }}>
                                    {locCity}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <LocationSelector
                        open={locationModalOpen}
                        onClose={() => setLocationModalOpen(false)}
                        currentLocation={user?.location}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'action.hover' }}>
                            <Badge variant="dot" color="error">
                                <NotificationsIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                        
                        {user?.role !== 'admin' && (
                            <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'action.hover' }}>
                                <AccountBalanceWalletIcon fontSize="small" />
                            </IconButton>
                        )}

                        <Box onClick={toggleDrawer(true)} sx={{ cursor: 'pointer' }}>
                            <UserProfile user={user} kycStatus={currentKycStatus} kycData={currentKycData} position="right" />
                        </Box>
                        <AppDrawer
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                            user={user}
                            kycStatus={currentKycStatus}
                            kycData={currentKycData}

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
