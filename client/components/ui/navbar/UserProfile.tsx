import React from 'react';
import { Box, Avatar, Typography } from "@mui/material";
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
}

const UserProfile: React.FC<UserProfileProps> = ({ user, kycStatus: kycStatusProp, kycData: kycDataProp, onClick, position = 'right' }) => {
    const profilePic = kycDataProp?.profilePicture || user?.kycData?.profilePicture;
    const profilePicUrl = profilePic ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/kyc/files/${profilePic}` : null;

    const kycConfig = {
        none: { color: 'text.disabled', label: 'Not Verified', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> },
        pending: { color: 'warning.main', label: 'Pending Verification', icon: <PendingIcon sx={{ fontSize: '0.8rem' }} /> },
        approved: { color: '#2e7d32', label: 'Verified', icon: <VerifiedIcon sx={{ fontSize: '0.8rem' }} /> },
        rejected: { color: 'error.main', label: 'Rejected', icon: <ErrorIcon sx={{ fontSize: '0.8rem' }} /> },
        returned: { color: 'warning.dark', label: 'Action Required', icon: <ErrorIcon sx={{ fontSize: '0.8rem' }} /> },
        resubmitted: { color: 'info.main', label: 'Resubmitted', icon: <ReplayIcon sx={{ fontSize: '0.8rem' }} /> },
        admin: { color: '#2e7d32', label: 'Admin', icon: <VerifiedIcon sx={{ fontSize: '0.8rem' }} /> },
    };

    const isAdmin = user?.role === 'admin';
    const status = isAdmin ? 'admin' : (kycStatusProp?.toLowerCase() || user?.kycStatus?.toLowerCase() || 'none') as keyof typeof kycConfig;
    const config = kycConfig[status] || kycConfig.none;

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
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'transparent',
                        overflow: 'hidden'
                    }}
                >
                    {profilePicUrl ? (
                        <Box 
                            component="img" 
                            src={profilePicUrl} 
                            sx={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                        />
                    ) : (
                        <PersonOutlineIcon sx={{ fontSize: '1.3rem', color: 'text.secondary' }} />
                    )}
                </Box>
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
