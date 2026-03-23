import React from 'react';
import { Box, Typography, alpha, useTheme } from '@mui/material';

interface HeadingProps {
    title: string;
    subtitle?: string;
    icon?: React.ElementType;
    color?: string;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, icon: Icon, color = 'primary.main' }) => {
    const theme = useTheme();
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 1 }}>
                {Icon && (
                    <Box sx={{ 
                        p: 1.5, 
                        borderRadius: 3, 
                        bgcolor: alpha(color, 0.1), 
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${alpha(color, 0.15)}`
                    }}>
                        <Icon sx={{ fontSize: 32 }} />
                    </Box>
                )}
                <Typography variant="h4" fontWeight={800} color="text.primary" letterSpacing="-0.02em">
                    {title}
                </Typography>
            </Box>
            {subtitle && (
                <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.7, ml: Icon ? 8.5 : 0 }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default Heading;
