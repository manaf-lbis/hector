import React from 'react';
import { Box, Typography, Grid, alpha, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminStatsCard, { StatItem } from './AdminStatsCard';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    stats?: StatItem[];
    onBack?: () => void;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle, stats, onBack }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {onBack && (
                    <IconButton 
                        onClick={onBack}
                        sx={{ 
                            mt: 0.5,
                            bgcolor: alpha('#000', 0.04),
                            '&:hover': { bgcolor: alpha('#000', 0.08) }
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                )}
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: 'primary.900',
                            letterSpacing: '-0.02em',
                            mb: 0.5,
                            fontSize: { xs: '1.75rem', md: '2.125rem' }
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                opacity: 0.8,
                                fontSize: { xs: '0.875rem', md: '1rem' }
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>

            {stats && stats.length > 0 && (
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
                            <AdminStatsCard {...stat} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default AdminPageHeader;
