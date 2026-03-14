import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile as FileIcon, Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';
import ButtonWithIcon from '@/components/ui/ButtonWithIcon';

interface KycUploadBoxProps {
    fileKey: string;
    label: string;
    hint: string;
    file: File | string | null;
    error?: string;
    onFileSelect: (file: File) => void;
    onRemove: () => void;
    onPreview: () => void;
}

const KycUploadBox: React.FC<KycUploadBoxProps> = ({
    fileKey, label, hint, file, error, onFileSelect, onRemove, onPreview
}) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) onFileSelect(f);
    };

    const fileName = file instanceof File ? file.name : (typeof file === 'string' ? file : '');

    return (
        <Box>
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={700} color={error ? "error.main" : "text.secondary"}>
                    {label} {error && ` - ${error}`}
                </Typography>
            </Box>
            <input 
                accept="image/*,application/pdf" 
                style={{ display: 'none' }} 
                id={`file-${fileKey}`} 
                type="file" 
                onChange={handleFileChange} 
            />
            <label htmlFor={`file-${fileKey}`}>
                <Box sx={{
                    py: file ? 3 : 4, px: 2,
                    border: '2px dashed',
                    borderColor: error ? 'error.main' : file ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    bgcolor: file ? alpha('#4caf50', 0.02) : error ? alpha('#d32f2f', 0.02) : 'transparent',
                    '&:hover': { borderColor: error ? 'error.dark' : 'primary.main', bgcolor: alpha('#1976d2', 0.02) },
                }}>
                    {!file && <CloudUploadIcon sx={{ fontSize: 32, color: error ? 'error.main' : 'action.disabled', mb: 1 }} />}
                    
                    {file ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FileIcon color="primary" fontSize="small" />
                                <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {fileName.length > 20 ? fileName.slice(0, 20) + '…' : fileName}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <ButtonWithIcon 
                                    text="Preview" 
                                    icon={VisibilityIcon} 
                                    size="sm" 
                                    variant="outlined" 
                                    onClick={(e) => { e.preventDefault(); onPreview(); }} 
                                />
                                <ButtonWithIcon 
                                    text="Remove" 
                                    icon={CloseIcon} 
                                    size="sm" 
                                    variant="outlined" 
                                    color="error" 
                                    onClick={(e) => { e.preventDefault(); onRemove(); }} 
                                />
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Typography variant="body2" color={error ? "error.main" : "text.secondary"}>
                                Drag & Drop or <Typography component="span" color={error ? "error.main" : "primary"} fontWeight={700}>Choose file</Typography>
                            </Typography>
                            <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
                                {hint}
                            </Typography>
                        </>
                    )}
                </Box>
            </label>
        </Box>
    );
};

export default KycUploadBox;
