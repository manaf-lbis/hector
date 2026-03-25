"use client";

import React, { useState } from 'react';
import { Container, CircularProgress, Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useGetKycStatusQuery } from '@/store/api/kyc.api';
import KycContainer from '@/components/features/kyc/KycContainer';
import UserPageHeader from '@/components/ui/UserPageHeader';

interface KycPageClientProps {
    config: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

export default function KycPageClient({ config }: KycPageClientProps) {
    const { user } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const theme = useTheme();
    const { data: statusResp, isLoading: isLoadingStatus } = useGetKycStatusQuery();

    const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const actualStatus = statusResp?.data?.status || statusResp?.status || statusResp?.data?.kycStatus || statusResp?.kycStatus;
    const hasSubmitted = (actualStatus && actualStatus !== 'none') || isSubmittingSuccess;

    React.useEffect(() => {
        if (!isLoadingStatus && !hasSubmitted && !isSubmittingSuccess) {
            setIsEditing(true);
        }
    }, [isLoadingStatus, hasSubmitted, isSubmittingSuccess]);

    if (isLoadingStatus) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }


    const handleBackPress = () => {
        if (isEditing && hasSubmitted) setIsEditing(false);
        else if (isViewing) setIsViewing(false);
        else router.push('/user');
    };

    const getHeaderContent = () => {
        if (isEditing) {
            if (hasSubmitted) return { title: 'Edit Application', subtitle: 'Correct your details and resubmit for verification.' };
            return { title: 'KYC Verification', subtitle: 'Complete your profile by verifying your identity.' };
        }

        if (isViewing) return { title: 'Application Details', subtitle: 'Review the information you submitted previously.' };

        const s = actualStatus?.toLowerCase();
        if (s === 'approved') return { title: 'KYC Verified', subtitle: 'Your account is fully verified and secure.' };
        if (s === 'pending' || s === 'resubmitted') return { title: 'KYC Under Review', subtitle: 'We are processing your documents normally.' };
        if (s === 'returned') return { title: 'Action Required', subtitle: 'Please correct the issues and resubmit.' };
        if (s === 'rejected') return { title: 'Verification Failed', subtitle: 'Your application was not approved.' };
        return { title: 'KYC Verification', subtitle: 'Complete your profile by verifying your identity.' };
    };

    const header = getHeaderContent();

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, pb: 12 }}>
            <UserPageHeader
                title={header.title}
                subtitle={header.subtitle}
                onBack={handleBackPress}
            />
            <KycContainer
                user={user}
                initialData={hasSubmitted ? (statusResp?.data || statusResp) : undefined}
                onSuccess={() => {
                    setIsSubmittingSuccess(true);
                    setIsEditing(false);
                    setIsViewing(false);
                    router.refresh();
                }}
                config={config}
                onBack={handleBackPress}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                isViewing={isViewing}
                onView={() => setIsViewing(true)}
                isSubmittingSuccess={isSubmittingSuccess}
                kycStatusReason={statusResp?.data?.reason || statusResp?.reason}
            />
        </Container>
    );
}
