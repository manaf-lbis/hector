"use client";

import React from 'react';
import { Box, Typography, Avatar, alpha } from '@mui/material';

interface CategoryPillsProps {
    categories: Array<{ id: string, name: string, image?: string }>;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ categories }) => {
    return (
        <Box sx={{ mb: 8 }}>
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
                BROWSE BY CATEGORY
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto', 
                pb: 1,
                scrollbarWidth: 'none', 
                '&::-webkit-scrollbar': { display: 'none' },
                flexWrap: 'nowrap',
                px: 1 // For subtle shadow breathing room
            }}>
                {categories.map((cat) => (
                    <Box 
                        key={cat._id}
                        className="surface-flat"
                        sx={{ 
                            flex: '0 0 auto',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            p: '8px 24px 8px 8px',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                bgcolor: alpha('#1B8A5A', 0.04),
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <Avatar 
                            src={cat.image} 
                            sx={{ 
                                width: 44, 
                                height: 44, 
                                bgcolor: alpha('#1B8A5A', 0.1),
                                color: 'primary.main',
                                fontWeight: 800,
                                fontSize: '1.2rem',
                                border: '2px solid white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            {cat.name[0]}
                        </Avatar>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ opacity: 0.8 }}>
                            {cat.name}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CategoryPills;
