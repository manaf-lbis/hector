import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { CheckCircleOutline as SuccessIcon, PendingActions as PendingIcon, ArrowBack as ArrowBackIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import ButtonWithIcon from '@/components/ui/ButtonWithIcon';

interface KycStatusDisplayProps {
    status: 'approved' | 'pending' | 'rejected' | 'none';
    onBack: () => void;
    onViewSubmission: () => void;
}

const KycStatusDisplay: React.FC<KycStatusDisplayProps> = ({ status, onBack, onViewSubmission }) => {
    const isApproved = status === 'approved';
    const isPending = status === 'pending';

    return (
        <Container maxWidth="sm" sx={{ py: 16, textAlign: 'center' }}>
            {isApproved ? (
                <SuccessIcon sx={{ fontSize: 72, color: 'success.main', mb: 3 }} />
            ) : (
                <PendingIcon sx={{ fontSize: 72, color: 'warning.main', mb: 3 }} />
            )}
            <Typography variant="h5" fontWeight={800} mb={1}>
                {isApproved ? 'KYC Verified' : 'KYC Pending Review'}
            </Typography>
            <Typography color="text.secondary" mb={6}>
                {isApproved 
                    ? 'Your identity has been successfully verified.' 
                    : 'Your documents are under review. We\'ll notify you within 24–48 hours once verified.'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <ButtonWithIcon text="Back to Dashboard" icon={ArrowBackIcon} side="left" onClick={onBack} />
                <ButtonWithIcon 
                    text="View Submission" 
                    icon={VisibilityIcon} 
                    variant="outlined" 
                    onClick={onViewSubmission} 
                />
            </Box>
        </Container>
    );
};

export default KycStatusDisplay;
