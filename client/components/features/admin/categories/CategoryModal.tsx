"use client";

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    alpha
} from '@mui/material';
import AppButton from '@/components/ui/AppButton';

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    title: string;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ open, onClose, onSubmit, initialData, title }) => {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                image: initialData.image || '',
                description: initialData.description || ''
            });
        } else {
            setFormData({ name: '', image: '', description: '' });
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 4, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', pb: 1 }}>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <TextField
                        label="Category Name"
                        name="name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <TextField
                        label="Image URL"
                        name="image"
                        fullWidth
                        value={formData.image}
                        onChange={handleChange}
                        variant="outlined"
                        helperText="Provide a URL for the category icon/image"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    
                    {formData.image && (
                        <Box sx={{ 
                            mt: 1, 
                            p: 2, 
                            borderRadius: 3, 
                            bgcolor: 'action.hover', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">Preview</Typography>
                            <Box 
                                component="img" 
                                src={formData.image} 
                                alt="Preview"
                                sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover' }}
                                onError={(e: any) => e.target.src = 'https://via.placeholder.com/80?text=Invalid'}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <AppButton onClick={onClose} variant="text" sx={{ fontWeight: 700, color: 'text.secondary' }}>Cancel</AppButton>
                <AppButton onClick={handleSubmit} variant="contained" sx={{ minWidth: 120 }}>
                    Save Category
                </AppButton>
            </DialogActions>
        </Dialog>
    );
};

export default CategoryModal;
