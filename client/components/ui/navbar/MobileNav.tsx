import React, { useState } from 'react';
import { Box, IconButton } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AppDrawer, { NavCategory } from "./AppDrawer";
import UserProfile from "./UserProfile";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import BadgeIcon from '@mui/icons-material/Badge';
import { SvgIconComponent } from '@mui/icons-material';

interface MobileNavProps {
    isAuthenticated: boolean;
    user: any;
    kycStatus?: string;
    navLinks: { id: number | string; label: string; href: string; icon: SvgIconComponent }[];
    onLogout: () => void;
    onDashboard: () => void;
    onNavigate: (href: string) => void;
    onLogin: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
    isAuthenticated,
    user,
    kycStatus,
    navLinks,
    onLogout,
    onDashboard,
    onNavigate,
    onLogin
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const categories: NavCategory[] = [
        {
            title: 'General',
            items: navLinks.map(link => ({
                ...link,
                action: () => onNavigate(link.href)
            }))
        },
        ...(isAuthenticated && user?.role !== 'admin' ? [{
            title: 'Profile',
            items: [
                { id: 'kyc', label: 'Update KYC', icon: BadgeIcon, action: () => onNavigate('/user/kyc') },
            ]
        }] : []),
        {
            title: 'Account',
            items: isAuthenticated ? [
                { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, action: onDashboard },
                { id: 'logout', label: 'Logout', icon: LogoutIcon, action: onLogout }
            ] : [
                { id: 'login', label: 'Sign In', icon: LoginIcon, action: onLogin }
            ]
        }
    ];

    return (
        <Box sx={{ display: { md: 'none' } }}>
            <Box 
                onClick={toggleDrawer(true)}
                sx={{ cursor: 'pointer' }}
            >
                {isAuthenticated ? (
                    <UserProfile user={user} kycStatus={kycStatus} position="right" />
                ) : (
                    <IconButton color="primary">
                        <MenuIcon />
                    </IconButton>
                )}
            </Box>

            <AppDrawer 
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                user={user}
                categories={categories}
                anchor="left"
            />
        </Box>
    );
};

export default MobileNav;
