import React from 'react';
import { Box, Paper, Typography, Divider, IconButton, alpha, FormControlLabel, Checkbox } from '@mui/material';
import { UploadFile as FileIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

interface ReviewStepProps {
    user: any;
    form: any;
    files: any;
    errors: any;
    onPreviewFile: (fileOrPublicId: File | string) => void;
    onOpenPolicy: () => void;
    onAgreedChange: (val: boolean) => void;
    config?: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

const ReviewStep: React.FC<ReviewStepProps> = ({ 
    user, form, files, errors, onPreviewFile, onOpenPolicy, onAgreedChange, config 
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
        <Box>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, bgcolor: alpha('#fff', 0.5), mb: 4 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 3, sm: 4 } }}>
                    {summaryItems.map(({ label, value }) => (
                        <Box key={label} sx={{ wordBreak: 'break-word' }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {label}
                            </Typography>
                            <Typography variant="body1" fontWeight={600} color="text.primary">{value || 'Not provided'}</Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Attached Documents
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 2 }}>
                    {Object.entries(files).filter(([, f]) => f).map(([key, file]) => {
                        const fileName = file instanceof File ? file.name : (typeof file === 'string' ? file : 'Document');
                        return (
                            <Box key={key} sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
                                px: 2, py: 1.2, borderRadius: 2,
                                border: '1px solid', borderColor: 'divider',
                                bgcolor: '#fff', flexGrow: { xs: 1, sm: 0 },
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                    <FileIcon color="primary" />
                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 150 }}>
                                        {fileName}
                                    </Typography>
                                </Box>
                                <IconButton size="small" color="primary" onClick={() => onPreviewFile(file as any)}>
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        );
                    })}
                </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, bgcolor: alpha('#1976d2', 0.03), borderColor: errors.agreedFinal ? 'error.main' : 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary" gutterBottom>
                    Declaration
                </Typography>
                
                <FormControlLabel
                    control={(
                        <Checkbox 
                            checked={form.agreedFinal} 
                            onChange={e => onAgreedChange(e.target.checked)} 
                            color={errors.agreedFinal ? "error" : "primary"} 
                        />
                    )}
                    label={
                        <Typography variant="body2" fontWeight={600} color={errors.agreedFinal ? "error.main" : "text.primary"}>
                            I agree to the <Typography component="span" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={(e) => { e.preventDefault(); onOpenPolicy(); }}>privacy policy</Typography> and authorize validation of my KYC.
                        </Typography>
                    }
                />
            </Paper>
        </Box>
    );
};

export default ReviewStep;
