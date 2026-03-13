"use client";

import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    IconButton,
    Collapse,
} from "@mui/material";
import { SvgIconComponent } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import UserProfile from './UserProfile';

export interface NavCategory {
    title: string;
    items: {
        id: string | number;
        label: string;
        href?: string;
        icon: SvgIconComponent;
        action?: () => void;
    }[];
}

interface AppDrawerProps {
    open: boolean;
    onClose: () => void;
    anchor?: 'left' | 'right';
    user: any;
    categories: NavCategory[];
}

const AppDrawer: React.FC<AppDrawerProps> = ({
    open,
    onClose,
    anchor = 'left',
    user,
    categories
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const handleToggleCategory = (title: string) => {
        setExpandedCategories(prev => {
            const currentState = prev[title] ?? true;
            return {
                ...prev,
                [title]: !currentState
            };
        });
    };

    return (
        <Drawer
            anchor={anchor}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 280,
                    pt: 2,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderTopLeftRadius: anchor === 'left' ? 0 : 20,
                    borderBottomLeftRadius: anchor === 'left' ? 0 : 20,
                    borderTopRightRadius: anchor === 'right' ? 0 : 20,
                    borderBottomRightRadius: anchor === 'right' ? 0 : 20,
                    boxShadow: 'none',
                    border: 'none',
                }
            }}
        >
            <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Menu</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* Profile Section */}
            <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)' }}>
                {user ? (
                    <UserProfile user={user} position="left" />
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Welcome! Please sign in to access more features.
                    </Typography>
                )}
            </Box>

            <Divider />

            <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
                {categories.map((category, index) => {
                    const isExpanded = expandedCategories[category.title] ?? true; // Default expanded for main sections

                    return (
                        <React.Fragment key={category.title}>
                            <ListItem
                                component="div"
                                onClick={() => handleToggleCategory(category.title)}
                                sx={{
                                    py: 1.5,
                                    cursor: 'pointer',
                                    bgcolor: 'rgba(0,0,0,0.01)',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' }
                                }}
                            >
                                <ListItemText
                                    primary={category.title.toUpperCase()}
                                    primaryTypographyProps={{
                                        variant: 'overline',
                                        fontWeight: 700,
                                        color: 'text.secondary',
                                        letterSpacing: '0.1rem'
                                    }}
                                />
                                {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                            </ListItem>

                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {category.items.map((item) => (
                                        <ListItem
                                            key={item.id}
                                            component="div"
                                            onClick={() => {
                                                if (item.action) item.action();
                                                onClose();
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                                                pl: 3,
                                                py: 1.2
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}>
                                                <item.icon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                            {index < categories.length - 1 && <Divider />}
                        </React.Fragment>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default AppDrawer;
