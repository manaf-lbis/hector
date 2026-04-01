"use client";

import React from 'react';
import { Card, CardContent, Typography, Box, alpha, Button } from '@mui/material';
import { DASHBOARD_STRINGS } from '@/constants/dashboard.constants';

const FarmerSupportCard = () => {
    return (
        <Card className="glass-secondary" elevation={0} sx={{ 
            height: { xs: 'auto', sm: '100%' }, 
            minHeight: { xs: 240, sm: 200 },
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            border: 'none',
        }}>
            <CardContent sx={{ 
                position: 'relative', 
                zIndex: 1, 
                p: { xs: 3, md: 4 },
                maxWidth: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { xs: 'flex-start', lg: 'center' },
                justifyContent: 'space-between',
                width: '100%',
                gap: { xs: 2.5, lg: 4 }
            }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 4, fontWeight: 900, mb: 1, display: 'block', opacity: 0.6 }}>
                        COMMUNITY SUPPORT
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ mb: 1.5, letterSpacing: '-0.01em' }}>
                        Empowering Our Farmer Backbone
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ 
                        maxWidth: 450,
                        lineHeight: 1.6, 
                        fontWeight: 500,
                        opacity: 0.7,
                    }}>
                        Every grain of rice and every vegetable on our table is the result of their hard work and dedication.
                    </Typography>
                </Box>

                <Box>
                    <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ 
                            borderRadius: '100px', 
                            px: 4, 
                            py: 1.2, 
                            fontWeight: 800,
                            boxShadow: '0 8px 25px rgba(27, 138, 90, 0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 35px rgba(27, 138, 90, 0.2)',
                            }
                        }}
                    >
                        Learn More
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FarmerSupportCard;
