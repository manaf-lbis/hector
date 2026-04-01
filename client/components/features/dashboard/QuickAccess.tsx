"use client";

import React from 'react';
import { Box, Typography, Grid, Paper, alpha } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { QUICK_ACCESS_ACTIONS, MANAGEMENT_ACTIONS } from '@/constants/dashboard.constants';
import * as Icons from '@mui/icons-material';

const QuickAccess = () => {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.user);

    const filteredActions = QUICK_ACCESS_ACTIONS.filter(action => 
        user?.role !== 'admin' || action.label !== 'Wallet'
    );

    const getIcon = (label: string, fontSize = 24) => {
        const iconStyle = { fontSize, color: 'primary.main' };
        if (label === 'Buy Items') return <Icons.TrendingUp sx={iconStyle} />;
        if (label === 'Wallet') return <Icons.AccountBalanceWallet sx={iconStyle} />;
        if (label === 'SELL CROPS') return <Icons.Storefront sx={iconStyle} />;
        if (label === 'My Bids') return <Icons.ListAlt sx={iconStyle} />;
        if (label === 'My Auctions') return <Icons.Gavel sx={iconStyle} />;
        return <Icons.Folder sx={iconStyle} />;
    };

    return (
        <Box sx={{ mb: 6 }}>
            <Typography 
                variant="h6" 
                fontWeight={800} 
                sx={{ 
                    mb: 4, 
                    color: 'text.primary', 
                    opacity: 0.4, 
                    letterSpacing: 2,
                    textAlign: 'left'
                }}
            >
                ACTIONS & MANAGEMENT
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {filteredActions.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: user?.role === 'admin' ? 4 : 3 }} key={index}>
                        <Paper 
                            className="surface-flat"
                            elevation={0}
                            onClick={() => router.push(action.path)}
                            sx={{ 
                                p: { xs: 2.5, md: 3 }, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2.5,
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: alpha('#1B8A5A', 0.04),
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            <Box sx={{ 
                                p: 1.5, 
                                bgcolor: alpha('#1B8A5A', 0.1),
                                borderRadius: '16px',
                                display: 'flex',
                            }}>
                                {getIcon(action.label)}
                            </Box>
                            <Box>
                                <Typography variant="body2" fontWeight={800} sx={{ color: 'text.primary', mb: 0.5 }}>
                                    {action.label}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, opacity: 0.5 }}>
                                    {action.sub}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {MANAGEMENT_ACTIONS.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Paper 
                            className="surface-flat"
                            elevation={0}
                            onClick={() => router.push(action.path)}
                            sx={{ 
                                p: { xs: 3, md: 4 }, 
                                color: 'text.primary',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    bgcolor: alpha('#1B8A5A', 0.04),
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            <Box sx={{ 
                                p: 2, 
                                bgcolor: alpha('#1B8A5A', 0.1),
                                borderRadius: '20px',
                                display: 'flex',
                            }}>
                                {getIcon(action.label, 36)}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5, letterSpacing: '-0.01em' }}>
                                    {action.label}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.5, fontWeight: 600 }}>
                                    {action.sub}
                                </Typography>
                            </Box>
                            <ArrowForwardIcon sx={{ opacity: 0.2, fontSize: 20 }} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default QuickAccess;
