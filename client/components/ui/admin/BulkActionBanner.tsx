import React from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Stack, 
    Slide, 
    alpha, 
    useTheme,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    Close as CloseIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    CheckCircle as ApproveIcon,
    RemoveCircleOutline as UnblockIcon
} from '@mui/icons-material';
import AppButton from '@/components/ui/AppButton';

export interface BulkAction {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
    variant?: 'contained' | 'outlined' | 'text';
}

interface BulkActionBannerProps {
    selectedCount: number;
    onClear: () => void;
    actions: BulkAction[];
}

const BulkActionBanner: React.FC<BulkActionBannerProps> = ({ 
    selectedCount, 
    onClear, 
    actions 
}) => {
    const theme = useTheme();

    return (
        <Slide direction="up" in={selectedCount > 0} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%) !important',
                    zIndex: theme.zIndex.appBar + 100,
                    width: 'auto',
                    minWidth: { xs: '90%', sm: '600px' },
                    pointerEvents: 'none'
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        pointerEvents: 'auto',
                        p: 1.5,
                        pl: 3,
                        borderRadius: '20px',
                        background: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 4
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '10px',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem'
                            }}
                        >
                            {selectedCount}
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                                {selectedCount} {selectedCount === 1 ? 'Item' : 'Items'} Selected
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                Select actions to perform in bulk
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        {actions.map((action, index) => (
                            <AppButton
                                key={index}
                                variant={action.variant || "contained"}
                                color={action.color || "primary"}
                                size="small"
                                onClick={action.onClick}
                                startIcon={action.icon}
                                sx={{ 
                                    borderRadius: '12px',
                                    px: 2,
                                    py: 1,
                                    height: '40px',
                                    fontWeight: 700,
                                    boxShadow: action.variant === 'contained' ? `0 4px 12px ${alpha(theme.palette[action.color || 'primary'].main, 0.3)}` : 'none'
                                }}
                            >
                                {action.label}
                            </AppButton>
                        ))}
                        
                        <Box sx={{ width: '1px', height: 24, bgcolor: alpha(theme.palette.divider, 0.1), mx: 1 }} />
                        
                        <Tooltip title="Clear Selection">
                            <IconButton 
                                size="small" 
                                onClick={onClear}
                                sx={{ 
                                    color: 'text.secondary',
                                    bgcolor: alpha(theme.palette.action.hover, 0.5),
                                    '&:hover': { bgcolor: 'action.hover', color: 'error.main' }
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Paper>
            </Box>
        </Slide>
    );
};

export default BulkActionBanner;
