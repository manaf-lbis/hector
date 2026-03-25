import React from 'react';
import { Box, Typography, TextField, Autocomplete, FormControlLabel, Checkbox, Divider } from '@mui/material';

interface IdentityStepProps {
    userName: string;
    form: any;
    errors: any;
    onFieldChange: (key: string, val: any) => void;
    config?: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

const IdentityStep: React.FC<IdentityStepProps> = ({ userName, form, errors, onFieldChange, config }) => {
    return (
        <Box sx={{ maxWidth: 640 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                    <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                        Full Name <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                    </Typography>
                    <TextField 
                        fullWidth 
                        value={userName} 
                        onChange={e => onFieldChange('userName', e.target.value)}
                        variant="outlined" 
                        placeholder="Enter your full name"
                        error={!!errors.userName} helperText={errors.userName}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            Date of Birth <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                        </Typography>
                        <TextField 
                            fullWidth type="date" InputLabelProps={{ shrink: true }}
                            value={form.dob} onChange={e => onFieldChange('dob', e.target.value)} variant="outlined" 
                            error={!!errors.dob} helperText={errors.dob} 
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            Document Type <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                        </Typography>
                        <Autocomplete
                            fullWidth
                            options={config?.DOCUMENT_TYPES || []}
                            getOptionLabel={(o: any) => o.label || ''}
                            value={config?.DOCUMENT_TYPES?.find(d => d.value === form.documentType) ?? null}
                            onChange={(_, v) => onFieldChange('documentType', v?.value ?? '')}
                            renderInput={params => (
                                <TextField {...params} placeholder="Please select" fullWidth variant="outlined" 
                                    error={!!errors.documentType} helperText={errors.documentType} 
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            )}
                        />
                    </Box>
                </Box>

                <Box>
                    <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                        ID/Passport Number <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                    </Typography>
                    <TextField 
                        fullWidth placeholder="Enter your ID/Passport number"
                        value={form.documentNumber} onChange={e => onFieldChange('documentNumber', e.target.value)} variant="outlined" 
                        error={!!errors.documentNumber} helperText={errors.documentNumber} 
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                </Box>

                <Divider sx={{ my: 1, opacity: 0.1 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>Bank Name</Typography>
                        <Autocomplete
                            fullWidth
                            options={config?.MAJOR_BANKS || []}
                            value={form.bankName || null}
                            onChange={(_, v) => onFieldChange('bankName', v ?? '')}
                            renderInput={params => (
                                <TextField {...params} placeholder="Search major banks..." fullWidth variant="outlined" 
                                    error={!!errors.bankName} helperText={errors.bankName} 
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            )}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>IFSC Code</Typography>
                        <TextField 
                            fullWidth placeholder="e.g. SBIN0001234"
                            value={form.ifsc} onChange={e => onFieldChange('ifsc', e.target.value.toUpperCase())}
                            inputProps={{ maxLength: 11 }} variant="outlined" error={!!errors.ifsc} helperText={errors.ifsc} 
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                    <Box>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>Account Number</Typography>
                        <TextField 
                            fullWidth placeholder="Enter bank account number" type="password"
                            value={form.accountNo} onChange={e => onFieldChange('accountNo', e.target.value)} variant="outlined" 
                            error={!!errors.accountNo} helperText={errors.accountNo} 
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>Confirm Account</Typography>
                        <TextField 
                            fullWidth placeholder="Re-enter account number"
                            value={form.confirmAccountNo} onChange={e => onFieldChange('confirmAccountNo', e.target.value)}
                            error={!!errors.confirmAccountNo} helperText={errors.confirmAccountNo} variant="outlined" 
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: 5 }}>
                <FormControlLabel
                    sx={{ alignItems: 'flex-start' }}
                    control={(
                        <Checkbox 
                            checked={form.agreedStep1} 
                            onChange={e => onFieldChange('agreedStep1', e.target.checked)} 
                            color={errors.agreedStep1 ? "error" : "primary"} 
                            sx={{ mt: -0.5 }}
                        />
                    )}
                    label={
                        <Typography variant="body2" color={errors.agreedStep1 ? "error.main" : "text.secondary"} sx={{ lineHeight: 1.6, ml: 1, opacity: 0.7 }}>
                            I agree that the uploaded documents are correct and agree to use for KYC verification purpose. Also I confirm that I uploaded valid government-issued photo ID.
                        </Typography>
                    }
                />
            </Box>
        </Box>
    );
};

export default IdentityStep;
