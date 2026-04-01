import React from 'react';
import { Box, Chip, alpha, Badge, Typography } from '@mui/material';
import AppButton from '../AppButton';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';

interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

interface AdminFilterProps {
    options: FilterOption[];
    activeValue: string;
    onSelect: (value: string) => void;
    onClear?: () => void;
    showClear?: boolean;
}

const AdminFilter: React.FC<AdminFilterProps> = ({ options, activeValue, onSelect, onClear, showClear }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mr: 1,
                px: 1,
                py: 0.5,
                borderRadius: '8px',
                bgcolor: alpha('#000', 0.03)
            }}>
                <FilterIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Filter
                </Typography>
            </Box>
            {options.map((option) => (
                <Badge
                    key={option.value}
                    badgeContent={option.count}
                    color="primary"
                    invisible={option.count === undefined}
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.65rem',
                            height: 18,
                            minWidth: 18,
                            top: 4,
                            right: 4,
                            bgcolor: activeValue === option.value ? 'white' : 'primary.main',
                            color: activeValue === option.value ? 'primary.main' : 'white',
                            border: `1px solid ${activeValue === option.value ? 'rgba(0,0,0,0.1)' : 'transparent'}`,
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                    }}
                >
                    <Chip
                        label={option.label}
                        onClick={() => onSelect(option.value)}
                        sx={{
                            borderRadius: '8px',
                            fontWeight: 700,
                            px: 1,
                            bgcolor: activeValue === option.value ? 'primary.main' : 'white',
                            color: activeValue === option.value ? 'white' : 'text.secondary',
                            border: activeValue === option.value ? 'none' : `1px solid ${alpha('#000', 0.1)}`,
                            '&:hover': {
                                bgcolor: activeValue === option.value ? 'primary.dark' : alpha('#000', 0.05),
                                borderColor: activeValue === option.value ? 'transparent' : alpha('#000', 0.2),
                            },
                            transition: 'all 0.2s ease',
                            height: 32
                        }}
                    />
                </Badge>
            ))}

            {showClear && onClear && (
                <AppButton
                    variant="text"
                    size="small"
                    onClick={onClear}
                    startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                    sx={{ 
                        ml: 1, 
                        height: 32, 
                        minWidth: 'auto',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: alpha('#f44336', 0.1),
                            color: 'error.main'
                        }
                    }}
                >
                    Clear Filters
                </AppButton>
            )}
        </Box>
    );
};

export default AdminFilter;
