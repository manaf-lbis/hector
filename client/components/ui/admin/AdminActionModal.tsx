"use client";

import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Typography, 
    TextField, 
    Box, 
    alpha
} from '@mui/material';
import AppButton from '@/components/ui/AppButton';
import { 
    CheckCircle as ApproveIcon, 
    Cancel as RejectIcon, 
    Reply as ReturnIcon,
    Warning as WarningIcon
} from '@mui/icons-material';

interface AdminActionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason?: string) => void;
    action: 'approve' | 'reject' | 'return';
    loading?: boolean;
    userName?: string;
}

const AdminActionModal: React.FC<AdminActionModalProps> = ({ 
    open, 
    onClose, 
    onConfirm, 
    action, 
    loading,
    userName 
}) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState(false);

    const config = {
        approve: {
            title: 'Approve KYC Application',
            color: '#1B8A5A',
            icon: ApproveIcon,
            desc: `Are you sure you want to approve the KYC application for ${userName}? This will grant the user full access.`,
            requireReason: false,
            btnText: 'Approve User'
        },
        reject: {
            title: 'Reject KYC Application',
            color: '#D32F2F',
            icon: RejectIcon,
            desc: `Rejecting ${userName}'s application is permanent. The user will NOT be able to resubmit their details.`,
            requireReason: true,
            btnText: 'Reject Permanently'
        },
        return: {
            title: 'Return for Correction',
            color: '#ED6C02',
            icon: ReturnIcon,
            desc: `Returning the application will allow ${userName} to edit and resubmit their details. Please specify what needs correction.`,
            requireReason: true,
            btnText: 'Return to User'
        }
    };

    const current = config[action];
    const Icon = current.icon;

    const handleConfirm = () => {
        if (current.requireReason && !reason.trim()) {
            setError(true);
            return;
        }
        onConfirm(current.requireReason ? reason : undefined);
    };

    return (
        <Dialog 
            open={open} 
            onClose={loading ? undefined : onClose}
            PaperProps={{
                sx: { 
                    borderRadius: 4, 
                    width: '100%', 
                    maxWidth: 500,
                    bgcolor: '#fcfdfa',
                    backgroundImage: 'none'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1, pt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '12px', 
                        bgcolor: alpha(current.color, 0.1), 
                        color: current.color,
                        display: 'flex'
                    }}>
                        <Icon />
                    </Box>
                    <Typography variant="h6" fontWeight={800}>{current.title}</Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: 1 }}>
                    {current.desc}
                </Typography>

                {current.requireReason && (
                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        rows={4}
                        label="Reason / Feedback"
                        placeholder={action === 'return' ? "e.g. ID card back image is blurry..." : "e.g. Fake documents detected..."}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if (error) setError(false);
                        }}
                        error={error}
                        helperText={error ? "Reason is required for this action" : ""}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                bgcolor: alpha('#000', 0.02)
                            }
                        }}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <AppButton 
                    variant="text"
                    onClick={onClose} 
                    disabled={loading}
                    sx={{ color: 'text.secondary', fontWeight: 700, px: 3 }}
                >
                    Cancel
                </AppButton>
                <AppButton 
                    variant="contained" 
                    onClick={handleConfirm}
                    loading={loading}
                    sx={{ 
                        bgcolor: `${current.color} !important`, 
                        '&:hover': { bgcolor: `${alpha(current.color, 0.8)} !important` },
                        fontWeight: 800,
                        borderRadius: 3,
                        px: 4,
                        boxShadow: `0 4px 14px ${alpha(current.color, 0.4)}`
                    }}
                >
                    {current.btnText}
                </AppButton>
            </DialogActions>
        </Dialog>
    );
};

export default AdminActionModal;
