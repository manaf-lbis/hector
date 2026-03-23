import React from 'react';
import { Box, Typography, alpha, useTheme, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export interface UserPageHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
}

const UserPageHeader: React.FC<UserPageHeaderProps> = ({ title, subtitle, onBack }) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {onBack && (
                <IconButton 
                    onClick={onBack}
                    sx={{ 
                        p: 0.8,
                        bgcolor: alpha(theme.palette.text.primary, 0.04),
                        '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) }
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: '1.1rem' }} />
                </IconButton>
            )}
            <Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 900,
                        color: 'text.primary',
                        letterSpacing: '-0.01em',
                        lineHeight: 1.2,
                        fontSize: { xs: '1rem', md: '1.15rem' }
                    }}
                >
                    {title}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            opacity: 0.7,
                            fontSize: { xs: '0.75rem', md: '0.85rem' }
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default UserPageHeader;
