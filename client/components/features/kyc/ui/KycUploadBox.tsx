import React from 'react';
import { Box, Typography, alpha, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile as FileIcon, Visibility as VisibilityIcon, Close as CloseIcon, Description as DescriptionIcon } from '@mui/icons-material';
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
            <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 1.5 }}>
                {label} <Typography component="span" color="error" sx={{ verticalAlign: 'top' }}>*</Typography>
            </Typography>
            
            <input 
                accept="image/*,application/pdf" 
                style={{ display: 'none' }} 
                id={`file-${fileKey}`} 
                type="file" 
                onChange={handleFileChange} 
            />
            
            <Box sx={{
                width: '100%',
                minHeight: 240,
                border: '2px dashed',
                borderColor: error ? 'error.main' : file ? '#a6e22e' : 'rgba(0,0,0,0.08)',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: file ? alpha('#a6e22e', 0.03) : 'transparent',
                '&:hover': { 
                    borderColor: '#a6e22e',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                    transform: 'translateY(-2px)'
                },
                position: 'relative'
            }}>
                <label htmlFor={`file-${fileKey}`} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '32px' }}>
                    {file ? (
                        <Box sx={{ textAlign: 'center', width: '100%' }}>
                            <Box sx={{ 
                                width: 80, height: 80, 
                                borderRadius: '50%', 
                                bgcolor: alpha('#a6e22e', 0.1), 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                mb: 2,
                                mx: 'auto'
                            }}>
                                <DescriptionIcon sx={{ fontSize: 40, color: '#4a7c00' }} />
                            </Box>
                            <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ mb: 0.5, px: 2 }}>
                                {fileName.length > 30 ? fileName.slice(0, 30) + '…' : fileName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                                File uploaded successfully
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                                <Button 
                                    size="small"
                                    variant="outlined"
                                    startIcon={<VisibilityIcon />}
                                    onClick={(e) => { e.preventDefault(); onPreview(); }}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, borderColor: 'divider', color: 'text.primary' }}
                                >
                                    View
                                </Button>
                                <Button 
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CloseIcon />}
                                    onClick={(e) => { e.preventDefault(); onRemove(); }}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                                >
                                    Remove
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body1" fontWeight={700} color="text.secondary" sx={{ mb: 3 }}>
                                Choose a file or drag & drop it here.
                            </Typography>
                            
                            <Box sx={{ 
                                display: 'inline-flex',
                                px: 4, py: 1.5,
                                bgcolor: 'rgba(0,0,0,0.05)',
                                borderRadius: 3,
                                fontWeight: 800,
                                fontSize: '0.875rem',
                                color: 'text.primary',
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' }
                            }}>
                                Browse File
                            </Box>
                            
                            {error && (
                                <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 2, fontWeight: 700 }}>
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    )}
                </label>
            </Box>
            
            {!file && !error && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, px: 1, opacity: 0.6 }}>
                    {hint}
                </Typography>
            )}
        </Box>
    );
};

export default KycUploadBox;
