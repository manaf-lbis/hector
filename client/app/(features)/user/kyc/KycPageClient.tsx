"use client";

import React, { useState } from 'react';
import { Container, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useGetKycStatusQuery } from '@/store/api/kyc.api';

import KycContainer from '@/components/features/kyc/KycContainer';
import KycStatusDisplay from '@/components/features/kyc/ui/KycStatusDisplay';

interface KycPageClientProps {
    config: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

export default function KycPageClient({ config }: KycPageClientProps) {
    const { user } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const { data: statusResp, isLoading: isLoadingStatus } = useGetKycStatusQuery();
    const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const actualStatus = statusResp?.data?.status || statusResp?.status || statusResp?.data?.kycStatus || statusResp?.kycStatus;

    if (isLoadingStatus) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isSubmittingSuccess || (actualStatus && actualStatus !== 'none' && actualStatus !== 'rejected' && !showDetails)) {
        return (
            <KycStatusDisplay 
                status={isSubmittingSuccess ? 'pending' : actualStatus} 
                onBack={() => router.push('/user')} 
                onViewSubmission={() => setShowDetails(true)} 
            />
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, pb: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 4, md: 6 } }}>
                <IconButton onClick={() => router.back()} sx={{ mr: 2, bgcolor: 'action.hover' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em" color="text.primary">
                    KYC Verification
                </Typography>
            </Box>

            <KycContainer 
                user={user} 
                initialData={showDetails ? (statusResp?.data || statusResp) : undefined} 
                onSuccess={() => setIsSubmittingSuccess(true)} 
                config={config}
            />
        </Container>
    );
}
