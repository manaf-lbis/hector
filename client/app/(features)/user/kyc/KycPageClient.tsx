"use client";

import React, { useState } from 'react';
import { Container, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useGetKycStatusQuery } from '@/store/api/kyc.api';

import KycContainer from '@/components/features/kyc/KycContainer';

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

    const actualStatus = statusResp?.data?.status || statusResp?.status || statusResp?.data?.kycStatus || statusResp?.kycStatus;

    if (isLoadingStatus) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    const hasSubmitted = (actualStatus && actualStatus !== 'none') || isSubmittingSuccess;

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 }, pb: 12 }}>
            <KycContainer
                user={user}
                initialData={hasSubmitted ? (statusResp?.data || statusResp) : undefined}
                onSuccess={() => {
                    setIsSubmittingSuccess(true);
                    router.refresh(); // Tells nextjs cache to refetch if needed
                }}
                config={config}
                onBack={() => {
                    router.push('/user');
                }}
            />
        </Container>
    );
}
