import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';
import KycUploadBox from '../ui/KycUploadBox';

interface UploadStepProps {
    files: any;
    errors: any;
    onFileSelect: (key: string, file: File) => void;
    onRemoveFile: (key: string) => void;
    onPreviewFile: (fileOrPublicId: File | string) => void;
    agreed: boolean;
    onAgreedChange: (val: boolean) => void;
}

const UploadStep: React.FC<UploadStepProps> = ({ 
    files, errors, onFileSelect, onRemoveFile, onPreviewFile, agreed, onAgreedChange 
}) => {
    return (
        <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 3, sm: 4 } }}>
                <KycUploadBox 
                    fileKey="idCardFront" 
                    label="Upload ID Proof (Front)" 
                    hint="Front side · pdf, png, jpeg"
                    file={files.idCardFront}
                    error={errors.idCardFront}
                    onFileSelect={(f) => onFileSelect('idCardFront', f)}
                    onRemove={() => onRemoveFile('idCardFront')}
                    onPreview={() => onPreviewFile(files.idCardFront)}
                />
                <KycUploadBox 
                    fileKey="idCardBack" 
                    label="Upload ID Proof (Back)" 
                    hint="Back side · pdf, png, jpeg"
                    file={files.idCardBack}
                    error={errors.idCardBack}
                    onFileSelect={(f) => onFileSelect('idCardBack', f)}
                    onRemove={() => onRemoveFile('idCardBack')}
                    onPreview={() => onPreviewFile(files.idCardBack)}
                />
                <KycUploadBox 
                    fileKey="bankPassbook" 
                    label="Upload Passbook" 
                    hint="Bank passbook or cheque · pdf, png, jpeg"
                    file={files.bankPassbook}
                    error={errors.bankPassbook}
                    onFileSelect={(f) => onFileSelect('bankPassbook', f)}
                    onRemove={() => onRemoveFile('bankPassbook')}
                    onPreview={() => onPreviewFile(files.bankPassbook)}
                />
            </Box>

            <Box sx={{ mt: 5 }}>
                <FormControlLabel
                    control={(
                        <Checkbox 
                            checked={agreed} 
                            onChange={e => onAgreedChange(e.target.checked)} 
                            color={errors.agreedStep2 ? "error" : "primary"} 
                        />
                    )}
                    label={
                        <Typography variant="body2" color={errors.agreedStep2 ? "error.main" : "text.secondary"} sx={{ lineHeight: 1.6 }}>
                            I confirm that I have uploaded clear and valid digital copies of my government-issued identity documents.
                        </Typography>
                    }
                />
            </Box>
        </Box>
    );
};

export default UploadStep;
