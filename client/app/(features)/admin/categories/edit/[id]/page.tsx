"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Paper,
    Grid,
    IconButton,
    Avatar,
    alpha,
    Stack,
    CircularProgress,
    Skeleton
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    ArrowBack as BackIcon,
    AddPhotoAlternate as AddPhotoIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useGetCategoriesQuery, useUpdateCategoryMutation } from '@/store/api/category.api';
import { toast } from 'react-hot-toast';
import AppButton from '@/components/ui/AppButton';
import ImageCropperModal from '@/components/ui/ImageCropperModal';

export default function EditCategoryPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: categories = [], isLoading: isFetching } = useGetCategoriesQuery();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [imageFile, setImageFile] = useState<Blob | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string>('');

    useEffect(() => {
        if (categories.length > 0 && id) {
            const category = categories.find((c: any) => c._id === id);
            if (category) {
                setFormData({
                    name: category.name || '',
                    description: category.description || ''
                });
                setImagePreview(category.image || null);
            }
        }
    }, [categories, id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempImageSrc(reader.result as string);
                setCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        setImageFile(croppedBlob);
        setImagePreview(URL.createObjectURL(croppedBlob));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return toast.error('Category name is required');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            if (imageFile) {
                data.append('image', imageFile, 'category-image.png');
            }

            await updateCategory({ id: id as string, body: data }).unwrap();
            toast.success('Category updated successfully');
            router.push('/admin/categories');
        } catch (error) {
            toast.error('Failed to update category');
        }
    };

    if (isFetching) return <Container maxWidth="lg" sx={{ py: 6 }}><Skeleton variant="rectangular" height={400} /></Container>;

    return (
        <Container maxWidth="lg" sx={{ py: 6, px: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: 'action.hover' }}>
                    <BackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={900}>Edit Category</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 500 }}>Modify existing category details and image.</Typography>
                </Box>
            </Box>

            <Paper elevation={0} className="surface-flat" sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 3, opacity: 0.5 }}>CATEGORY ICON</Typography>
                                
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <Avatar
                                        src={imagePreview || ''}
                                        sx={{ 
                                            width: 160, 
                                            height: 160, 
                                            borderRadius: '32px',
                                            bgcolor: alpha('#1B8A5A', 0.05),
                                            color: '#1B8A5A',
                                            border: '2px dashed',
                                            borderColor: imagePreview ? 'primary.main' : 'divider',
                                        }}
                                    >
                                        {!imagePreview && <AddPhotoIcon sx={{ fontSize: 48, opacity: 0.3 }} />}
                                    </Avatar>

                                    <IconButton
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            position: 'absolute',
                                            bottom: -10,
                                            right: -10,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            boxShadow: '0 4px 15px rgba(27, 138, 90, 0.3)',
                                            '&:hover': { bgcolor: '#146b45' }
                                        }}
                                    >
                                        <UploadIcon size={20} />
                                    </IconButton>
                                </Box>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                <Typography variant="caption" display="block" sx={{ mt: 3, fontWeight: 600, opacity: 0.4 }}>
                                    Recommend square image.<br />PNG or JPG only.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, opacity: 0.5 }}>BASIC INFORMATION</Typography>
                                    <TextField
                                        label="Category Name"
                                        name="name"
                                        fullWidth
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, opacity: 0.5 }}>DESCRIPTION</Typography>
                                    <TextField
                                        label="Category Description"
                                        name="description"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Box>

                                <Box sx={{ pt: 2, display: 'flex', gap: 2 }}>
                                    <AppButton 
                                        type="submit" 
                                        variant="contained" 
                                        disabled={isUpdating}
                                        sx={{ px: 6, py: 1.5, borderRadius: '12px', minWidth: 200 }}
                                    >
                                        {isUpdating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update Category'}
                                    </AppButton>
                                    <AppButton 
                                        variant="outlined" 
                                        color="secondary"
                                        onClick={() => router.back()}
                                        sx={{ px: 4, borderRadius: '12px' }}
                                    >
                                        Cancel
                                    </AppButton>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <ImageCropperModal
                open={cropModalOpen}
                imageSrc={tempImageSrc}
                onClose={() => setCropModalOpen(false)}
                onCropComplete={handleCropComplete}
                aspectRatio={1}
                cropShape="rect"
                title="Crop Category Image"
            />
        </Container>
    );
}
