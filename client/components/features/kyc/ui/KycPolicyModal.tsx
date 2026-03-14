import React from 'react';
import { Modal, Paper, Box, Typography, IconButton, Divider, CircularProgress } from '@mui/material';
import { Close as CloseIcon, CheckCircleOutline as SuccessIcon } from '@mui/icons-material';
import ButtonWithIcon from '@/components/ui/ButtonWithIcon';

interface KycPolicyModalProps {
    open: boolean;
    onClose: () => void;
    policyText: string;
    isLoading: boolean;
    onAccept: () => void;
}

const KycPolicyModal: React.FC<KycPolicyModalProps> = ({ open, onClose, policyText, isLoading, onAccept }) => {
    return (
        <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Paper sx={{ width: '100%', maxWidth: 500, p: 4, borderRadius: 2, outline: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={800}>Privacy Policy</Typography>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {policyText || 'Failed to load privacy policy.'}
                    </Typography>
                )}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <ButtonWithIcon 
                        text="I Understand" 
                        icon={SuccessIcon} 
                        onClick={() => { onAccept(); onClose(); }} 
                    />
                </Box>
            </Paper>
        </Modal>
    );
};

export default KycPolicyModal;
