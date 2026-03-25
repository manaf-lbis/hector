"use client";

import React from 'react';
import { Alert, Typography, Box, alpha, useTheme } from '@mui/material';
import { Description as DocIcon } from '@mui/icons-material';

interface KycStatusAlertProps {
    status: string;
    reason?: string;
}

const KycStatusAlert: React.FC<KycStatusAlertProps> = ({ status, reason }) => {
    const kycStatus = status.toLowerCase();
    const theme = useTheme();

    if (kycStatus === 'approved') {
        return (
            <Alert
                severity="success"
                sx={{ mb: 4 }}
            >
                <Typography variant="subtitle2" fontWeight={900}>KYC Verification Successful</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Your account is fully verified. You can now access all premium features.
                </Typography>
            </Alert>
        );
    }

    if (kycStatus === 'pending' || kycStatus === 'resubmitted') {
        return (
            <Alert
                severity="info"
                icon={<DocIcon />}
                sx={{ mb: 4 }}
            >
                <Typography variant="subtitle2" fontWeight={900}>KYC Under Verification</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    We're reviewing your documents. This normally takes 24-48 hours.
                </Typography>
            </Alert>
        );
    }

    if (kycStatus === 'returned') {
        return (
            <Alert
                severity="warning"
                sx={{ mb: 4 }}
            >
                <Typography variant="subtitle2" fontWeight={900}>Action Required: Application Returned</Typography>
                {reason && (
                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                        Reason: {reason}
                    </Typography>
                )}
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                    Please update and resubmit your details for verification.
                </Typography>
            </Alert>
        );
    }

    if (kycStatus === 'rejected') {
        return (
            <Alert
                severity="error"
                sx={{ mb: 4 }}
            >
                <Typography variant="subtitle2" fontWeight={900}>Application Permanently Rejected</Typography>
                {reason && (
                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                        Reason: {reason}
                    </Typography>
                )}
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                    Your KYC has been rejected. Please contact support for assistance.
                </Typography>
            </Alert>
        );
    }

    return null;
};

export default KycStatusAlert;
