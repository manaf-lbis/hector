"use client";

import React from 'react';
import { Box, Typography, useTheme, useMediaQuery, IconButton } from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import ForestIcon from '@mui/icons-material/Forest';
import LandscapeIcon from '@mui/icons-material/Landscape';
import PestControlIcon from '@mui/icons-material/PestControl';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ParkIcon from '@mui/icons-material/Park';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Left Form Column */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '50%' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 2, sm: 4, md: 8 }
                    }}
                >
                    {children}
                </Box>

                {/* Right Promo Column */}
                {isMdUp && (
                    <Box
                        sx={{ width: { xs: '100%', md: '50%' }, p: 2, display: 'flex', flexDirection: 'column' }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                bgcolor: theme.palette.primary.light + '1A', // Very light primary shade
                                borderRadius: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                p: 6
                            }}
                        >
                            {/* Central Graphic Title */}
                            <Box sx={{ textAlign: 'center', mb: 8, zIndex: 2 }}>
                                <Typography variant="h4" fontWeight={800} color="text.primary">
                                    Write Better <Box component="span" sx={{ color: 'primary.main' }}>Everywhere</Box>
                                </Typography>
                            </Box>

                            {/* Orbital Graphic wrapper */}
                            <Box sx={{ position: 'relative', width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                                {/* Outer decorative rings */}
                                <Box sx={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', border: `1px solid ${theme.palette.primary.main}33` }} />
                                <Box sx={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: `1px solid ${theme.palette.primary.main}4D` }} />
                                <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: `1px solid ${theme.palette.primary.main}66` }} />

                                {/* Central Identity */}
                                <Box
                                    sx={{
                                        width: 90,
                                        height: 90,
                                        borderRadius: '50%',
                                        bgcolor: 'primary.main',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 12px 32px ${theme.palette.primary.main}80`,
                                        zIndex: 2
                                    }}
                                >
                                    <AgricultureIcon sx={{ color: 'white', fontSize: 48 }} />
                                </Box>

                                {/* Orbiting Icons */}
                                <IconButton sx={{ position: 'absolute', top: 30, right: 100, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <WbSunnyIcon sx={{ color: '#FF9800' }} />
                                </IconButton>
                                <IconButton sx={{ position: 'absolute', bottom: 60, left: 60, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <ForestIcon sx={{ color: 'success.main' }} />
                                </IconButton>
                                <IconButton sx={{ position: 'absolute', top: 100, left: 50, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <WaterDropIcon sx={{ color: '#2196F3' }} />
                                </IconButton>
                                <IconButton sx={{ position: 'absolute', bottom: 120, right: 40, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <GrassIcon sx={{ color: '#4CAF50' }} />
                                </IconButton>
                                <IconButton sx={{ position: 'absolute', bottom: 180, right: 10, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <ParkIcon sx={{ color: '#2E7D32' }} />
                                </IconButton>
                                <IconButton sx={{ position: 'absolute', top: 190, left: 10, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <PestControlIcon sx={{ color: '#F44336' }} />
                                </IconButton>
                                <IconButton sx={{ position: 'absolute', bottom: 30, left: 200, bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: 'white' } }}>
                                    <LandscapeIcon sx={{ color: '#795548' }} />
                                </IconButton>
                            </Box>

                            {/* Bottom Promotional Text */}
                            <Box sx={{ textAlign: 'center', mt: 8, maxWidth: 450, zIndex: 2 }}>
                                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Compatible with <strong>Mobile, Desktop, Web, Cloud and most devices</strong> for a smooth user experience anywhere online.
                                </Typography>

                                {/* Fake pagination dots to mimic mockup */}
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
                                    <Box sx={{ width: 24, height: 4, borderRadius: 2, bgcolor: 'primary.main' }} />
                                    <Box sx={{ width: 12, height: 4, borderRadius: 2, bgcolor: 'primary.main', opacity: 0.3 }} />
                                    <Box sx={{ width: 12, height: 4, borderRadius: 2, bgcolor: 'primary.main', opacity: 0.3 }} />
                                </Box>
                            </Box>

                            {/* Decorative gradient overlay */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '40%',
                                    background: `linear-gradient(to top, ${theme.palette.background.paper}99, transparent)`,
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
