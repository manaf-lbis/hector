import React from 'react';
import { Paper, Box, Typography, alpha, SvgIconProps } from '@mui/material';

export interface StatItem {
    label: string;
    value: string | number;
    icon: React.ElementType<SvgIconProps>;
    color?: string;
}

const AdminStatsCard: React.FC<StatItem> = ({ label, value, icon: Icon, color = '#1B8A5A' }) => {
    return (
        <Paper
            sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: '24px',
                bgcolor: 'background.paper',
                border: theme => `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                }
            }}
        >
            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'block',
                        mb: 0.5
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        lineHeight: 1
                    }}
                >
                    {value}
                </Typography>
            </Box>

            <Box
                sx={{
                    p: 1.5,
                    borderRadius: '16px',
                    bgcolor: alpha(color as string, 0.08),
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Icon sx={{ fontSize: 24 }} />
            </Box>
        </Paper>
    );
};

export default AdminStatsCard;
