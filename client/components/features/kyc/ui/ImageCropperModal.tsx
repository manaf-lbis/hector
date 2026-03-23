"use client";

import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Slider,
    Typography,
    alpha
} from '@mui/material';
import Cropper, { Area } from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageUtils';

interface ImageCropperModalProps {
    open: boolean;
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (croppedImage: Blob) => void;
    aspectRatio?: number;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
    open,
    imageSrc,
    onClose,
    onCropComplete,
    aspectRatio = 1
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: { x: number, y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            if (croppedAreaPixels && imageSrc) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (croppedImage) {
                    onCropComplete(croppedImage);
                    onClose();
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden' }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid', borderColor: 'divider' }}>
                Crop Profile Picture
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: 400, position: 'relative', bgcolor: '#000' }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspectRatio}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={onZoomChange}
                    cropShape="round"
                    showGrid={false}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 2 }}>
                <Box sx={{ width: '100%', px: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        Zoom
                    </Typography>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, newValue) => setZoom(newValue as number)}
                        sx={{ mt: 1 }}
                    />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onClose} sx={{ fontWeight: 700, textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave}
                        sx={{ 
                            fontWeight: 800, 
                            textTransform: 'none', 
                            px: 4, 
                            borderRadius: 2,
                            boxShadow: 'none'
                        }}
                    >
                        Save & Apply
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ImageCropperModal;
