import React from 'react';
import { Modal, Paper, Box, Typography, IconButton, alpha } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import DocumentViewer from '@/components/ui/DocumentViewer';

interface KycPreviewModalProps {
    open: boolean;
    onClose: () => void;
    previewFile: { file?: File, url: string, type: 'image' | 'pdf' } | null;
}

const KycPreviewModal: React.FC<KycPreviewModalProps> = ({ open, onClose, previewFile }) => {
    return (
        <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Paper sx={{ position: 'relative', width: '100%', maxWidth: 800, maxHeight: '90vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', outline: 'none' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ maxWidth: '80%' }}>
                        {previewFile?.file ? previewFile.file.name : 'Document Preview'}
                    </Typography>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, height: { xs: '70vh', md: '80vh' } }}>
                    {previewFile ? (
                        <DocumentViewer documents={[{ uri: previewFile.url, fileName: previewFile.file?.name, fileType: previewFile.type }]} />
                    ) : null}
                </Box>
            </Paper>
        </Modal>
    );
};

export default KycPreviewModal;
