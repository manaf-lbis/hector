"use client";

import React from "react";
import { Box, Typography, Container, Paper, alpha } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UserProfile from "@/components/ui/navbar/UserProfile";

export default function AdminDashboard() {
    const { user } = useSelector((state: RootState) => state.user);
    
    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    return (
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
            <Paper 
                className="surface-flat"
                elevation={0}
                sx={{ 
                    p: { xs: 3, md: 5 }, 
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 4,
                    border: `1px solid ${alpha('#1B8A5A', 0.1)}`,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                {/* Visual Accent */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: -100, 
                    right: -100, 
                    width: 300, 
                    height: 300, 
                    borderRadius: '50%', 
                    bgcolor: alpha('#1B8A5A', 0.05),
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Box sx={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <UserProfile showName={false} size={80} />
                </Box>

                <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <Typography 
                        variant="overline" 
                        sx={{ 
                            fontWeight: 800, 
                            color: 'primary.main', 
                            letterSpacing: 2,
                            opacity: 0.8
                        }}
                    >
                        ADMINISTRATOR PANEL
                    </Typography>
                    <Typography 
                        variant="h3" 
                        fontWeight={900} 
                        sx={{ 
                            mt: 0.5, 
                            mb: 1,
                            background: 'linear-gradient(45deg, #1B8A5A 30%, #2E7D32 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {greeting}, {user?.name?.split(' ')[0] || 'Admin'}! 👋
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: 'text.secondary', 
                            maxWidth: '600px',
                            lineHeight: 1.6,
                            fontWeight: 500
                        }}
                    >
                        Welcome back to your command center. You have full oversight of the platform, including user verifications, category management, and system-wide monitoring.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
