import React from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';

interface AddressStepProps {
    form: any;
    errors: any;
    onFieldChange: (key: string, val: any) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ form, errors, onFieldChange }) => {
    return (
        <Box sx={{ maxWidth: 640 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                    <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                        House Name / Building / Landmark <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                    </Typography>
                    <TextField 
                        fullWidth 
                        value={form.location || ''} 
                        onChange={e => onFieldChange('location', e.target.value)}
                        variant="outlined" 
                        placeholder="Enter your house name or landmark"
                        error={!!errors.location} helperText={errors.location}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                    />
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            State <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                        </Typography>
                        <TextField 
                            fullWidth 
                            value={form.state || ''} 
                            onChange={e => onFieldChange('state', e.target.value)}
                            variant="outlined" 
                            placeholder="Enter state"
                            error={!!errors.state} helperText={errors.state}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            District <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                        </Typography>
                        <TextField 
                            fullWidth 
                            value={form.district || ''} 
                            onChange={e => onFieldChange('district', e.target.value)}
                            variant="outlined" 
                            placeholder="Enter district"
                            error={!!errors.district} helperText={errors.district}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            Taluk <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                        </Typography>
                        <TextField 
                            fullWidth 
                            value={form.taluk || ''} 
                            onChange={e => onFieldChange('taluk', e.target.value)}
                            variant="outlined" 
                            placeholder="Enter taluk"
                            error={!!errors.taluk} helperText={errors.taluk}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                            Pincode <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
                        </Typography>
                        <TextField 
                            fullWidth 
                            value={form.pincode || ''} 
                            onChange={e => onFieldChange('pincode', e.target.value)}
                            variant="outlined" 
                            placeholder="6-digit pincode"
                            inputProps={{ maxLength: 6 }}
                            error={!!errors.pincode} helperText={errors.pincode}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AddressStep;
