import React from 'react';
import { Box, Avatar, Typography } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import ReplayIcon from '@mui/icons-material/Replay';

interface UserProfileProps {
    user: {
        name: string;
        role: string;
        kycStatus?: string;
    } | null;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    position?: 'left' | 'right';
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClick, position = 'right' }) => {
    const kycConfig = {
        pending: { color: 'warning.main', label: 'KYC Pending', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> },
        approved: { color: 'success.main', label: 'KYC Approved', icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} /> },
        rejected: { color: 'error.main', label: 'KYC Rejected', icon: <ErrorIcon sx={{ fontSize: '0.8rem' }} /> },
        resubmitted: { color: 'info.main', label: 'KYC Resubmitted', icon: <ReplayIcon sx={{ fontSize: '0.8rem' }} /> },
        admin: { color: '#2e7d32', label: 'Admin', icon: <CheckCircleIcon sx={{ fontSize: '0.8rem' }} /> },
    };

    const isAdmin = user?.role === 'admin';
    const status = isAdmin ? 'admin' : (user?.kycStatus?.toLowerCase() as keyof typeof kycConfig) || 'pending';
    const config = kycConfig[status] || kycConfig.pending;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { opacity: 0.8 },
                flexDirection: position === 'left' ? 'row' : 'row'
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2.5px solid',
                    borderColor: config.color,
                    p: '2px',
                    bgcolor: 'transparent'
                }}
            >
                <Avatar
                    sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: 'transparent',
                        background: 'none',
                        backgroundImage: 'none',
                        color: 'text.secondary',
                        border: 'none'
                    }}
                >
                    <PersonOutlineIcon sx={{ fontSize: '1.3rem' }} />
                </Avatar>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 120 }}>
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
