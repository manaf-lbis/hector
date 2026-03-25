"use client";

import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Chip,
    Divider,
    alpha,
    Alert,
    CircularProgress,
    IconButton,
    Stack
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    AccessTime as TimeIcon,
    History as HistoryIcon,
    ArrowBack as ArrowBackIcon,
    Schedule as ClockIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Reply as ReturnIcon,
    Badge as BadgeIcon,
    VerifiedUser as VerifiedIcon,
    Block as BlockIcon,
    CheckCircleOutline as ActiveIcon
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useGetUserDetailsQuery, useGetLoginLogsQuery, useUpdateUserStatusMutation } from '@/store/api/userAdmin.api';
import { useReviewKycMutation } from '@/store/api/kyc.api';
import KycContainer from '@/components/features/kyc/KycContainer';
import AdminActionModal from '@/components/ui/admin/AdminActionModal';
import AppButton from '@/components/ui/AppButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BRAND } from '@/app/theme';

export default function AdminUserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const { data: userResponse, isLoading: isLoadingUser, refetch: refetchUser } = useGetUserDetailsQuery(userId);
    const [reviewKyc, { isLoading: isReviewing }] = useReviewKycMutation();
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
    const [modalConfig, setModalConfig] = useState<{ open: boolean, action: 'approve' | 'reject' | 'return' }>({
        open: false,
        action: 'approve'
    });

    if (isLoadingUser) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    const user = userResponse?.data || userResponse;
    if (!user) {
        return <Alert severity="error">User not found</Alert>;
    }

    const hasKyc = !!user.kycData;
    const kycStatus = user.kycData?.kycStatus || 'none';

    const handleActionClick = (action: 'approve' | 'reject' | 'return') => {
        setModalConfig({ open: true, action });
    };

    const handleConfirmAction = async (reason?: string) => {
        try {
            await reviewKyc({
                kycId: user.kycData._id,
                status: modalConfig.action === 'approve' ? 'approved' : modalConfig.action === 'reject' ? 'rejected' : 'returned',
                reason
            }).unwrap();
            setModalConfig(p => ({ ...p, open: false }));
            refetchUser();
        } catch (err) {
            console.error("Failed to review KYC:", err);
        }
    };

    const handleToggleBlock = async () => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        try {
            await updateStatus({ userId, status: newStatus }).unwrap();
            refetchUser();
        } catch (err) {
            console.error("Failed to update user status:", err);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <IconButton
                    onClick={() => router.back()}
                    sx={{
                        mt: 0.5,
                        bgcolor: alpha('#000', 0.04),
                        '&:hover': { bgcolor: alpha('#000', 0.08) }
                    }}
                >
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 4 }} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    bgcolor: BRAND.primary[500],
                                    color: 'white'
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>{user.name}</Typography>
                                <Typography variant="caption" color="primary" fontWeight={800} sx={{ bgcolor: alpha(BRAND.primary[500], 0.1), px: 1, py: 0.2, borderRadius: 1 }}>
                                    #{user.customId || user._id.substring(0, 8)}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 4 }} sx={{ flexGrow: 1 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Email</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Phone</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{user.phone || 'Not provided'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Last Login</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                                label={user.status === 'active' ? 'Full Access' : 'Restricted'}
                                size="small"
                                color={user.status === 'active' ? 'success' : 'error'}
                                variant={user.status === 'active' ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 800 }}
                            />
                            <AppButton
                                size="small"
                                color={user.status === 'active' ? 'error' : 'success'}
                                startIcon={user.status === 'active' ? <BlockIcon /> : <ActiveIcon />}
                                onClick={handleToggleBlock}
                                loading={isUpdatingStatus}
                            >
                                {user.status === 'active' ? 'Block Account' : 'Unblock Account'}
                            </AppButton>
                        </Box>
                    </Stack>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* KYC Review Section (Full Width) */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 0, overflow: 'hidden', border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 4, bgcolor: alpha(BRAND.primary[500], 0.03), borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 900 }}>Identity Verification</Typography>
                                <Typography variant="body2" color="text.secondary">Review documents and banking information provided by the user.</Typography>
                            </Box>

                            {/* Action Buttons for Admins */}
                            {hasKyc && (kycStatus === 'pending' || kycStatus === 'resubmitted' || kycStatus === 'returned') && (
                                <Stack direction="row" spacing={1.5}>
                                    <AppButton
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<ReturnIcon />}
                                        onClick={() => handleActionClick('return')}
                                        disabled={kycStatus === 'returned'}
                                    >
                                        Return
                                    </AppButton>
                                    <AppButton
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleActionClick('reject')}
                                    >
                                        Reject
                                    </AppButton>
                                    <AppButton
                                        color="success"
                                        startIcon={<CheckIcon />}
                                        onClick={() => handleActionClick('approve')}
                                    >
                                        Approve
                                    </AppButton>
                                </Stack>
                            )}

                            {kycStatus === 'approved' && (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Chip
                                        icon={<VerifiedIcon />}
                                        label="KYC Verified"
                                        color="success"
                                        sx={{ fontWeight: 900, px: 1, height: 40, '& .MuiChip-icon': { fontSize: 24 } }}
                                    />
                                    <AppButton
                                        variant="outlined"
                                        size="small"
                                        color="primary"
                                        onClick={() => handleActionClick('return')}
                                    >
                                        Request Update (Re-eKYC)
                                    </AppButton>
                                </Stack>
                            )}

                            {kycStatus === 'rejected' && (
                                <Chip
                                    icon={<CancelIcon />}
                                    label="Permanently Rejected"
                                    color="error"
                                    sx={{ fontWeight: 900, px: 1, height: 40 }}
                                />
                            )}
                        </Box>

                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                            {hasKyc ? (
                                <KycContainer
                                    user={user}
                                    initialData={{
                                        ...user.kycData,
                                        kycStatus: user.kycData.kycStatus
                                    }}
                                    onSuccess={() => { }}
                                    onBack={() => { }}
                                    config={{
                                        DOCUMENT_TYPES: [
                                            { value: 'aadhar', label: 'Aadhaar Card' },
                                            { value: 'pan', label: 'PAN Card' },
                                            { value: 'voters_id', label: 'Voter ID' },
                                            { value: 'driving_license', label: 'Driving License' }
                                        ],
                                        MAJOR_BANKS: ['SBI', 'HDFC', 'ICICI', 'Axis', 'KOTAK', 'CANARA', 'PNB']
                                    }}
                                    isAdmin={true}
                                />
                            ) : (
                                <Box sx={{ p: 10, textAlign: 'center' }}>
                                    <Box sx={{ mb: 3 }}>
                                        <BadgeIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.3 }} />
                                    </Box>
                                    <Typography variant="h6" fontWeight={800} gutterBottom>No KYC Submission</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                                        This user has not yet initiated the verification process.
                                        Once they submit their documents, they will appear here for review.
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Reason Display for Admins */}
                        {user.kycData?.reason && (
                            <Box sx={{ p: 3, bgcolor: alpha(user.kycData.kycStatus === 'rejected' ? '#D32F2F' : '#ED6C02', 0.05), borderTop: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="caption" fontWeight={900} display="block" color={user.kycData.kycStatus === 'rejected' ? 'error' : 'warning.main'}>
                                    PREVIOUS {user.kycStatus === 'rejected' ? 'REJECTION' : 'RETURN'} REASON:
                                </Typography>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 0.5 }}>
                                    "{user.kycData.reason}"
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Confirmation Modal */}
            <AdminActionModal
                open={modalConfig.open}
                onClose={() => setModalConfig(p => ({ ...p, open: false }))}
                onConfirm={handleConfirmAction}
                action={modalConfig.action}
                loading={isReviewing}
                userName={user.name}
            />
        </Container>
    );
}
