"use client";

import { AppBar, Toolbar, Container, Button, Box } from "@mui/material";
import Logo from "../ui/Logo";
import NavLinks from "../ui/navbar/NavLinks";
import UserProfile from "../ui/navbar/UserProfile";
import MobileNav from "../ui/navbar/MobileNav";
import AppDrawer, { NavCategory } from "../ui/navbar/AppDrawer";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import ButtonWithIcon from "../ui/ButtonWithIcon";
import LoginIcon from '@mui/icons-material/Login';
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/auth.slice";
import { useLogoutMutation } from "@/store/api/auth.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import HomeIcon from '@mui/icons-material/Home';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CallIcon from '@mui/icons-material/Call';
import BadgeIcon from '@mui/icons-material/Badge';

const navLinks = [
    { id: 1, label: 'Home', href: '/', icon: HomeIcon },
    { id: 2, label: 'About Us', href: '/about', icon: InfoOutlineIcon },
    { id: 3, label: 'Services', href: '/services', icon: MiscellaneousServicesIcon },
    { id: 4, label: 'Contact', href: '/contact', icon: CallIcon },
];

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);
    const [serverLogout] = useLogoutMutation();
    const currentKycStatus = user?.kycStatus;
    const currentKycData = user?.kycData;


    const [isTriggeringModal, setIsTriggeringModal] = useState(false);

    useEffect(() => {
        const authTrigger = searchParams.get('auth');
        if (authTrigger === 'login') {
            setIsTriggeringModal(true);

            const params = new URLSearchParams(searchParams.toString());
            params.delete('auth');
            const newPath = params.toString() ? `/?${params.toString()}` : '/';
            router.replace(newPath, { scroll: false });
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (isTriggeringModal && !searchParams.get('auth')) {
            setIsTriggeringModal(false);
            router.push('/auth/login');
        }
    }, [isTriggeringModal, searchParams, router]);

    const handleLogout = async () => {
        try {
            await serverLogout().unwrap();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            dispatch(logout());
            router.push('/');
            setDesktopDrawerOpen(false);
        }
    };

    const handleDashboard = () => {
        if (user?.role === 'admin') router.push('/admin');
        else router.push('/user');
    };

    const handleKYC = () => {
        router.push('/user/kyc');
    };

    const handleNavigate = (href: string) => {
        router.push(href);
    };

    const toggleDesktopDrawer = (open: boolean) => () => {
        setDesktopDrawerOpen(open);
    };

    const categories: NavCategory[] = [
        {
            title: 'General',
            items: navLinks.map(link => ({
                ...link,
                action: () => handleNavigate(link.href)
            }))
        },
        ...(isAuthenticated && user?.role !== 'admin' ? [{
            title: 'Profile',
            items: [
                { id: 'kyc', label: 'Update KYC', icon: BadgeIcon, action: handleKYC },
            ]
        }] : []),
        {
            title: 'Account',
            items: isAuthenticated ? [
                { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, action: handleDashboard },
                { id: 'logout', label: 'Logout', icon: LogoutIcon, action: handleLogout }
            ] : [
                { id: 'login', label: 'Sign In', icon: LoginIcon, action: () => router.push('/auth/login') }
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
                    <Logo navigateTo="/" />

                    <NavLinks navLinks={navLinks} showIcons={false} />

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                            {isAuthenticated ? (
                                <>
                                    <Box onClick={toggleDesktopDrawer(true)} sx={{ cursor: 'pointer' }}>
                                        <UserProfile user={user} kycStatus={currentKycStatus} kycData={currentKycData} />
                                    </Box>
                                    <AppDrawer
                                        open={desktopDrawerOpen}
                                        onClose={toggleDesktopDrawer(false)}
                                        user={user}
                                        kycStatus={currentKycStatus}
                                        kycData={currentKycData}

                                        categories={categories}
                                        anchor="right"
                                    />
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Link href='/auth/login'>
                                        <Button
                                            sx={{
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                fontWeight: 500,
                                                color: 'rgba(0, 0, 0, 0.7)',
                                                '&:hover': {
                                                    color: '#000',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                },
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href='/auth/login'>
                                        <ButtonWithIcon variant="outlined" size="md" color="primary" />
                                    </Link>
                                </Box>
                            )}
                        </Box>

                        {/* Unified Mobile Navigation */}
                        <MobileNav
                            isAuthenticated={isAuthenticated}
                            user={user}
                            kycStatus={currentKycStatus}
                            navLinks={navLinks}
                            onLogout={handleLogout}
                            onDashboard={handleDashboard}
                            onNavigate={handleNavigate}
                            onLogin={() => router.push('/auth/login')}
                        />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
