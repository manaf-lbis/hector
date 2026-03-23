import React from 'react';
import { Button, ButtonProps, CircularProgress, alpha, Typography } from '@mui/material';
import { BRAND } from '@/app/theme';

interface AppButtonProps extends Omit<ButtonProps, 'color'> {
    loading?: boolean;
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info' | 'black' | 'white';
}

const AppButton: React.FC<AppButtonProps> = ({ 
    children, 
    loading = false, 
    disabled, 
    variant = 'contained', 
    color = 'primary',
    sx,
    ...props 
}) => {
    // Basic color mapping
    const getColors = () => {
        if (color === 'primary') return { main: BRAND.primary[600], hover: BRAND.primary[500], text: BRAND.white };
        if (color === 'secondary') return { main: BRAND.secondary[500], hover: BRAND.secondary[400], text: BRAND.primary[800] };
        if (color === 'error') return { main: '#EF4444', hover: '#DC2626', text: BRAND.white };
        if (color === 'success') return { main: BRAND.primary[500], hover: BRAND.primary[600], text: BRAND.white };
        if (color === 'black') return { main: BRAND.inkDark, hover: BRAND.muted, text: BRAND.white };
        if (color === 'white') return { main: BRAND.white, hover: BRAND.lightBg, text: BRAND.primary[600] };
        return { main: BRAND.primary[600], hover: BRAND.primary[500], text: BRAND.white };
    };

    const c = getColors();

    return (
        <Button
            variant={variant}
            disabled={disabled || loading}
            sx={{
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 800,
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                
                ...(variant === 'contained' && {
                    bgcolor: `${c.main} !important`,
                    color: `${c.text} !important`,
                    boxShadow: `0 4px 14px ${alpha(c.main, 0.35)}`,
                    '&:hover': {
                        bgcolor: `${c.hover} !important`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(c.main, 0.45)}`,
                    }
                }),

                ...(variant === 'outlined' && {
                    borderColor: `${alpha(c.main, 0.4)} !important`,
                    color: `${c.main} !important`,
                    background: alpha(c.main, 0.05),
                    backdropFilter: "blur(8px)",
                    '&:hover': {
                        borderColor: `${c.main} !important`,
                        background: alpha(c.main, 0.1),
                        transform: 'translateY(-2px)',
                    }
                }),

                ...(variant === 'text' && {
                    color: `${c.main} !important`,
                    '&:hover': {
                        background: alpha(c.main, 0.08),
                        transform: 'translateY(-1px)',
                    }
                }),

                '&:active': { transform: 'scale(0.96)' },
                ...sx
            }}
            {...props}
        >
            {loading ? <CircularProgress size={18} color="inherit" sx={{ mr: 1.5 }} /> : null}
            {children}
        </Button>
    );
};

export default AppButton;
