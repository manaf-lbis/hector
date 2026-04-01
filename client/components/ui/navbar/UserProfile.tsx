import React from 'react';
import { Box, Avatar, Typography, alpha } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import ReplayIcon from '@mui/icons-material/Replay';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedIcon from '@mui/icons-material/Verified';

interface UserProfileProps {
    user: {
        name: string;
        role: string;
        kycStatus?: string;
        kycData?: {
            profilePicture?: string;
        };
    } | null;
    kycData?: {
        profilePicture?: string;
    };
    kycStatus?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    position?: 'left' | 'right';
    size?: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
    user, 
    kycStatus: kycStatusProp, 
    kycData: kycDataProp, 
    onClick, 
    position = 'right',
    size = 42
}) => {
    const profilePic = kycDataProp?.profilePicture || user?.kycData?.profilePicture;
    const profilePicUrl = profilePic ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/kyc/files/${profilePic}` : null;

    const kycConfig = {
        none: { color: '#9e9e9e', label: 'Not Verified', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> },
        pending: { color: '#ed6c02', label: 'Pending Verification', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> },
        approved: { color: '#2e7d32', label: 'Verified', icon: <VerifiedIcon sx={{ fontSize: '0.8rem' }} /> },
        rejected: { color: '#d32f2f', label: 'Rejected', icon: <ErrorIcon sx={{ fontSize: '0.8rem' }} /> },
        returned: { color: '#f57c00', label: 'Action Required', icon: <ErrorIcon sx={{ fontSize: '0.8rem' }} /> },
        resubmitted: { color: '#0288d1', label: 'Resubmitted', icon: <ReplayIcon sx={{ fontSize: '0.8rem' }} /> },
        admin: { color: '#2e7d32', label: 'Admin', icon: <VerifiedIcon sx={{ fontSize: '0.8rem' }} /> },
    };

    const isAdmin = user?.role === 'admin';
    const status = isAdmin ? 'admin' : (kycStatusProp?.toLowerCase() || user?.kycStatus?.toLowerCase() || 'none') as keyof typeof kycConfig;
    const config = kycConfig[status] || kycConfig.none;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': onClick ? { 
                    '& .profile-avatar': { transform: 'scale(1.05)', boxShadow: `0 4px 12px ${alpha(config.color as string, 0.2)}` },
                    '& .profile-info': { opacity: 0.8 }
                } : {},
                flexDirection: position === 'left' ? 'row' : 'row'
            }}
            onClick={onClick}
        >
            <Box
                className="profile-avatar"
                sx={{
                    width: size,
                    height: size,
                    borderRadius: `${(size / 42) * 12}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `${Math.max(1, (size / 42) * 2)}px solid`,
                    borderColor: config.color,
                    p: `${Math.max(1, (size / 42) * 2)}px`,
                    bgcolor: 'transparent',
                    transition: 'all 0.3s ease'
                }}
            >
                <Avatar
                    src={profilePicUrl || undefined}
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: `${(size / 42) * 10}px`,
                        bgcolor: profilePicUrl ? 'transparent' : alpha(config.color as string, 0.1),
                        color: config.color,
                        fontWeight: 900,
                        fontSize: `${(size / 42) * 1}rem`,
                        border: profilePicUrl ? 'none' : `1px dashed ${alpha(config.color as string, 0.3)}`
                    }}
                >
                    {user?.name ? getInitials(user.name) : <PersonOutlineIcon sx={{ fontSize: `${(size / 42) * 1.4}rem` }} />}
                </Avatar>
            </Box>
            <Box className="profile-info" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 140, transition: 'all 0.2s ease' }}>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {user?.name || 'User Name'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: config.color }}>
                    {config.icon}
                    <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.65rem' }}>
                        {config.label}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default UserProfile;
