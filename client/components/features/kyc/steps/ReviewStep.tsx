import React from 'react';
import { Box, Typography, Divider, IconButton, alpha, FormControlLabel, Checkbox, TextField } from '@mui/material';
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
    config?: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
    user, form, files, errors, onPreviewFile, onOpenPolicy, onAgreedChange, isReviewOnly, config 
}) => {
    const summaryItems = [
        { label: 'Full Name', value: user?.name },
        { label: 'Date of Birth', value: form.dob },
        { label: 'Document Type', value: config?.DOCUMENT_TYPES?.find(d => d.value === form.documentType)?.label },
        { label: 'Document Number', value: form.documentNumber },
        { label: 'Bank Name', value: form.bankName },
        { label: 'IFSC Code', value: form.ifsc },
        { label: 'Account Number', value: form.accountNo },
    ];

    return (
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={900} color="text.primary" letterSpacing="-0.02em">
                        Details Overview
                    </Typography>
                    {isReviewOnly && (
                        <Typography variant="caption" fontWeight={900} color="#a6e22e" sx={{ bgcolor: alpha('#a6e22e', 0.1), px: 1.5, py: 0.5, borderRadius: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Submitted
                        </Typography>
                    )}
                </Box>
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
                        };
                        const displayLabel = labels[key] || 'Document';
                        return (
                            <Box key={key} sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: alpha('#000', 0.01), borderColor: 'text.secondary' }
                            }}>
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
                    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: alpha('#1976d2', 0.1) }}>
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
