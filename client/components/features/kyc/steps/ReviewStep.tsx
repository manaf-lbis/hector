import React from 'react';
import { Box, Typography, Divider, IconButton, alpha, FormControlLabel, Checkbox, TextField, useTheme } from '@mui/material';
import { BOX_VARIANTS } from '@/app/theme';
import { UploadFile as FileIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

interface ReviewStepProps {
    user: any;
    form: any;
    files: any;
    errors: any;
    onPreviewFile: (fileOrPublicId: File | string) => void;
    onOpenPolicy: () => void;
    onAgreedChange: (val: boolean) => void;
    isReviewOnly?: boolean;
    status?: string;
    config?: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

const ReviewStep: React.FC<ReviewStepProps> = ({
    user, form, files, errors, onPreviewFile, onOpenPolicy, onAgreedChange, isReviewOnly, status, config
}) => {
    const theme = useTheme();
    const summaryItems = [
        { label: 'Full Name', value: form.userName },
        { label: 'Date of Birth', value: form.dob },
        { label: 'Document Type', value: config?.DOCUMENT_TYPES?.find(d => d.value === form.documentType)?.label },
        { label: 'Document Number', value: form.documentNumber },
        { label: 'Bank Name', value: form.bankName },
        { label: 'IFSC Code', value: form.ifsc },
        { label: 'Account Number', value: form.accountNo },
    ];

    const addressItems = [
        { label: 'House Name / Landmark', value: form.location },
        { label: 'State', value: form.state },
        { label: 'District', value: form.district },
        { label: 'Taluk', value: form.taluk },
        { label: 'Pincode', value: form.pincode },
    ];

    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={900} color="text.primary" letterSpacing="-0.02em">
                    Details Overview
                </Typography>
                {isReviewOnly && (
                    <Typography
                        variant="caption"
                        fontWeight={900}
                        color={status === 'approved' ? "#a6e22e" : "#f59e0b"}
                        sx={{
                            bgcolor: alpha(status === 'approved' ? "#a6e22e" : "#f59e0b", 0.1),
                            px: 1.5, py: 0.5, borderRadius: 1.5,
                            textTransform: 'uppercase', letterSpacing: 1
                        }}
                    >
                        {status === 'approved' ? 'Verified' : 'Submitted'}
                    </Typography>
                )}
            </Box>

            {files.profilePicture && (
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3, p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.03), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                    <Box
                        component="img"
                        src={typeof files.profilePicture === 'string' ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/kyc/files/${files.profilePicture}` : URL.createObjectURL(files.profilePicture)}
                        sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: theme.shadows[2] }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={800} color="text.primary">Profile Identity Photo</Typography>
                        <Typography variant="body2" color="text.secondary">This photo will be used for your official profile and documents.</Typography>
                        {status === 'approved' && user.kycData?.approvedOn && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'success.main', fontWeight: 700 }}>
                                Verified on {new Date(user.kycData.approvedOn).toLocaleDateString()} by {user.kycData.approvedBy?.name || 'System Admin'}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                {summaryItems.map(({ label, value }) => (
                    <Box key={label} sx={{
                        gridColumn: label === 'Full Name' ? '1 / -1' : 'auto'
                    }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            {label}
                        </Typography>
                        <TextField
                            fullWidth
                            value={value || '—'}
                            disabled
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>
                ))}
            </Box>

            <Typography variant="h6" fontWeight={900} color="text.primary" letterSpacing="-0.02em" sx={{ mt: 6, mb: 3 }}>
                Address Details
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                {addressItems.map(({ label, value }) => (
                    <Box key={label} sx={{
                        gridColumn: label === 'House Name / Landmark' ? '1 / -1' : 'auto'
                    }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            {label}
                        </Typography>
                        <TextField
                            fullWidth
                            value={value || '—'}
                            disabled
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>
                ))}
            </Box>

            <Divider sx={{ mb: 6, opacity: 0.1 }} />

            <Box sx={{ mb: 6 }}>
                <Typography variant="h6" fontWeight={900} color="text.primary" letterSpacing="-0.02em" sx={{ mb: 3 }}>
                    Attached Documents
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(files).filter(([, f]) => f).map(([key, file]) => {
                        const labels: Record<string, string> = {
                            idCardFront: 'ID Card (Front)',
                            idCardBack: 'ID Card (Back)',
                            bankPassbook: 'Bank Passbook',
                            profilePicture: 'Profile Picture'
                        };
                        const displayLabel = labels[key] || 'Document';
                        return (
                            <Box key={key} sx={BOX_VARIANTS['surface-review-item']}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <FileIcon color="action" fontSize="small" />
                                    <Typography variant="body2" fontWeight={700} color="text.primary">
                                        {displayLabel}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => onPreviewFile(file as any)}
                                    sx={{ color: 'primary.main', bgcolor: alpha('#1976d2', 0.05) }}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {!isReviewOnly && (
                <>
                    <Divider sx={{ mb: 6, opacity: 0.1 }} />
                    <Box sx={BOX_VARIANTS['surface-outlined']}>
                        <Typography variant="subtitle2" fontWeight={900} color="text.primary" gutterBottom>
                            Declaration
                        </Typography>

                        <FormControlLabel
                            sx={{ alignItems: 'flex-start', mt: 1 }}
                            control={(
                                <Checkbox
                                    checked={form.agreedFinal}
                                    onChange={e => onAgreedChange(e.target.checked)}
                                    color={errors.agreedFinal ? "error" : "primary"}
                                    sx={{ mt: -0.5, p: 0.5 }}
                                />
                            )}
                            label={
                                <Typography variant="body2" color={errors.agreedFinal ? "error.main" : "text.secondary"} sx={{ lineHeight: 1.6, ml: 1, opacity: 0.8 }}>
                                    I hereby declare that the information provided is authentic and I accept the <Typography component="span" color="primary" fontWeight={800} sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); onOpenPolicy(); }}>Terms & Conditions</Typography>.
                                </Typography>
                            }
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ReviewStep;
