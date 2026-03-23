import React from 'react';
import { Box, Typography } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';

interface DocumentViewerProps {
    documents: { uri: string; fileName?: string; fileType?: string }[];
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const doc = documents?.[0];

    React.useEffect(() => {
        if (!doc || !doc.uri) {
            setBlobUrl(null);
            return;
        }
        if (doc.uri.startsWith('http')) {
            setLoading(true);
            setError(null);

            fetch(doc.uri, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error(`Status ${res.status}`);
                    return res.blob();
                })
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setBlobUrl(url);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Blob fetch error:", err);
                    setError("Failed to load document securelly.");
                    setLoading(false);
                });

            return () => {
                if (blobUrl) URL.revokeObjectURL(blobUrl);
            };
        } else {
            setBlobUrl(null);
            setLoading(false);
        }
    }, [doc]);

    if (!doc) {
        return (
            <Box sx={{ textAlign: 'center', opacity: 0.15 }}>
                <DescriptionIcon sx={{ fontSize: 180, color: '#fff' }} />
                <Typography variant="h6" color="#fff" fontWeight={800} sx={{ mt: 2 }}>
                    No Document Selected
                </Typography>
            </Box>
        );
    }

    const isImage = doc.fileType?.toLowerCase().includes('image') ||
        doc.uri.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i);
    const isPdf = doc.fileType?.toLowerCase().includes('pdf') ||
        doc.uri.toLowerCase().match(/\.pdf(\?.*)?$/i);

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            bgcolor: '#1a1d17',
            p: { xs: 1, md: 2 }
        }}>
            {loading ? (
                <Typography color="#fff">Loading Document...</Typography>
            ) : error ? (
                <Box sx={{ textAlign: 'center', color: 'error.main', p: 4 }}>
                    <Typography fontWeight={700}>{error}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                        Please ensure you are logged in.
                    </Typography>
                </Box>
            ) : isImage ? (
                <img
                    src={blobUrl || doc.uri}
                    alt={doc.fileName || 'Document'}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                    }}
                />
            ) : isPdf ? (
                <iframe
                    src={`${blobUrl || doc.uri}#toolbar=0`}
                    width="100%"
                    height="100%"
                    style={{ border: 'none', backgroundColor: '#fff' }}
                    title={doc.fileName || "PDF Document"}
                />
            ) : (
                <Box sx={{ textAlign: 'center', opacity: 0.5, color: '#fff' }}>
                    <DescriptionIcon sx={{ fontSize: 64, mb: 1 }} />
                    <Typography>Preview not available</Typography>
                </Box>
            )}
        </Box>
    );
};

export default DocumentViewer;
