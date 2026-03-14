import React from 'react';
import { Box, Typography, TextField, Autocomplete, FormControlLabel, Checkbox } from '@mui/material';

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
        <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 3, sm: 4 } }}>
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Name</Typography>
                    <TextField fullWidth value={userName} disabled variant="outlined" />
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Date of Birth</Typography>
                    <TextField 
                        fullWidth type="date" InputLabelProps={{ shrink: true }}
                        value={form.dob} onChange={e => onFieldChange('dob', e.target.value)} variant="outlined" 
                        error={!!errors.dob} helperText={errors.dob} 
                    />
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Document Type</Typography>
                    <Autocomplete
                        fullWidth
                        options={config?.DOCUMENT_TYPES || []}
                        getOptionLabel={(o: any) => o.label || ''}
                        value={config?.DOCUMENT_TYPES?.find(d => d.value === form.documentType) ?? null}
                        onChange={(_, v) => onFieldChange('documentType', v?.value ?? '')}
                        renderInput={params => (
                            <TextField {...params} placeholder="Select document" fullWidth variant="outlined" 
                                error={!!errors.documentType} helperText={errors.documentType} />
                        )}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Document Number</Typography>
                    <TextField 
                        fullWidth placeholder="Enter document number"
                        value={form.documentNumber} onChange={e => onFieldChange('documentNumber', e.target.value)} variant="outlined" 
                        error={!!errors.documentNumber} helperText={errors.documentNumber} 
                    />
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Choose Bank</Typography>
                    <Autocomplete
                        fullWidth
                        options={config?.MAJOR_BANKS || []}
                        value={form.bankName || null}
                        onChange={(_, v) => onFieldChange('bankName', v ?? '')}
                        renderInput={params => (
                            <TextField {...params} placeholder="Search major banks..." fullWidth variant="outlined" 
                                error={!!errors.bankName} helperText={errors.bankName} />
                        )}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>IFSC Code</Typography>
                    <TextField 
                        fullWidth placeholder="e.g. SBIN0001234"
                        value={form.ifsc} onChange={e => onFieldChange('ifsc', e.target.value.toUpperCase())}
                        inputProps={{ maxLength: 11 }} variant="outlined" error={!!errors.ifsc} helperText={errors.ifsc} 
                    />
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Account Number</Typography>
                    <TextField 
                        fullWidth placeholder="Enter bank account number" type="password"
                        value={form.accountNo} onChange={e => onFieldChange('accountNo', e.target.value)} variant="outlined" 
                        error={!!errors.accountNo} helperText={errors.accountNo} 
                    />
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 1 }}>Confirm Account</Typography>
                    <TextField 
                        fullWidth placeholder="Re-enter account number"
                        value={form.confirmAccountNo} onChange={e => onFieldChange('confirmAccountNo', e.target.value)}
                        error={!!errors.confirmAccountNo} helperText={errors.confirmAccountNo} variant="outlined" 
                    />
                </Box>
            </Box>

            <Box sx={{ mt: 5 }}>
                <FormControlLabel
                    control={(
                        <Checkbox 
                            checked={form.agreedStep1} 
                            onChange={e => onFieldChange('agreedStep1', e.target.checked)} 
                            color={errors.agreedStep1 ? "error" : "primary"} 
                        />
                    )}
                    label={
                        <Typography variant="body2" color={errors.agreedStep1 ? "error.main" : "text.secondary"} sx={{ lineHeight: 1.6 }}>
                            I agree that the uploaded documents are correct and agree to use for KYC verification purpose. Also I confirm that I uploaded valid government-issued photo ID. This ID includes my picture, signature, name, date of birth, and address.
                        </Typography>
                    }
                />
            </Box>
        </Box>
    );
};

export default IdentityStep;
