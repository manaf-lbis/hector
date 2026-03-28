import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography, Divider } from '@mui/material';
import KycUploadBox from '../ui/KycUploadBox';

interface UploadStepProps {
    files: any;
    errors: any;
    onFileSelect: (key: string, file: File) => void;
    onProfilePicSelect: (file: File) => void;
    onRemoveFile: (key: string) => void;
    onPreviewFile: (fileOrPublicId: File | string) => void;
    agreed: boolean;
    onAgreedChange: (val: boolean) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ 
    files, errors, onFileSelect, onProfilePicSelect, onRemoveFile, onPreviewFile, agreed, onAgreedChange 
}) => {
    return (
        <Box sx={{ width: '100%', maxWidth: 800 }}>
            <Box sx={{ mb: 6 }}>
                <KycUploadBox 
                    fileKey="profilePicture" 
                    label="Profile Picture" 
                    hint="A clear photo of your face · png, jpeg"
                    file={files.profilePicture}
                    error={errors.profilePicture}
                    accept="image/jpeg,image/jpg,image/png"
                    onFileSelect={(f) => onProfilePicSelect(f)}
                    onRemove={() => onRemoveFile('profilePicture')}
                    onPreview={() => onPreviewFile(files.profilePicture)}
                />
            </Box>

            <Divider sx={{ mb: 6, opacity: 0.1 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" , gap: 4 }}>
                <KycUploadBox 
                    fileKey="idCardFront" 
                    label="Id proof Font Side" 
                    hint="Supported file types: PNG, JPG, JPEG, PDF. Maximum file size: 5MB"
                    file={files.idCardFront}
                    error={errors.idCardFront}
                    onFileSelect={(f) => onFileSelect('idCardFront', f)}
                    onRemove={() => onRemoveFile('idCardFront')}
                    onPreview={() => onPreviewFile(files.idCardFront)}
                />
                <KycUploadBox 
                    fileKey="idCardBack" 
                    label="Id proof Back Side" 
                    hint="Supported file types: PNG, JPG, JPEG, PDF. Maximum file size: 5MB"
                    file={files.idCardBack}
                    error={errors.idCardBack}
                    onFileSelect={(f) => onFileSelect('idCardBack', f)}
                    onRemove={() => onRemoveFile('idCardBack')}
                    onPreview={() => onPreviewFile(files.idCardBack)}
                />
            </Box>

            <Divider sx={{ my: 6, opacity: 0.1 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                <KycUploadBox 
                    fileKey="bankPassbook" 
                    label="Bank Passbook" 
                    hint="Bank passbook or cheque · pdf, png, jpeg"
                    file={files.bankPassbook}
                    error={errors.bankPassbook}
                    onFileSelect={(f) => onFileSelect('bankPassbook', f)}
                    onRemove={() => onRemoveFile('bankPassbook')}
                    onPreview={() => onPreviewFile(files.bankPassbook)}
                />
            </Box>

            <Box sx={{ mt: 6, p: 2, borderRadius: 2 }}>
                <FormControlLabel
                    sx={{ alignItems: 'flex-start' }}
                    control={(
                        <Checkbox 
                            checked={agreed} 
                            onChange={e => onAgreedChange(e.target.checked)} 
                            color={errors.agreedStep2 ? "error" : "primary"} 
                            sx={{ mt: -0.5 }}
                        />
                    )}
                    label={
                        <Typography variant="body2" color={errors.agreedStep2 ? "error.main" : "text.secondary"} sx={{ lineHeight: 1.6, ml: 1, opacity: 0.7 }}>
                            I confirm that I have uploaded clear and valid digital copies of my government-issued identity documents and bank details for verification.
                        </Typography>
                    }
                />
            </Box>
        </Box>
    );
};

export default UploadStep;
