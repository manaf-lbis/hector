"use client";

import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, IconButton, Alert, alpha, Card, Divider, Grid, Breadcrumbs, Link as MuiLink, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Send as SendIcon, NavigateNext as NavigateNextIcon, Description as DocIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSubmitKycMutation, useGetPrivacyPolicyQuery } from '@/store/api/kyc.api';
import ButtonWithIcon from '@/components/ui/ButtonWithIcon';
import { validateDob, validateDocumentNumber, validateIfsc, validateAccountNumber } from '@/utils/validators/kycValidator';

import IdentityStep from './steps/IdentityStep';
import UploadStep from './steps/UploadStep';
import ReviewStep from './steps/ReviewStep';
import KycPreviewModal from './ui/KycPreviewModal';
import KycPolicyModal from './ui/KycPolicyModal';
import DocumentViewer from '@/components/ui/DocumentViewer';

const STEPS = ['Proof of Identity', 'Proof of address', 'Upload Document'];

interface KycContainerProps {
    user: any;
    initialData?: any;
    onSuccess: () => void;
    onBack: () => void;
    config: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

const KycContainer: React.FC<KycContainerProps> = ({ user, initialData, onSuccess, onBack, config }) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeStep, setActiveStep] = useState(0);
    const [submitKyc, { isLoading: isSubmitting, isSuccess, error: submitError }] = useSubmitKycMutation();
    const { data: policyData, isLoading: isLoadingPolicy } = useGetPrivacyPolicyQuery();

    const [form, setForm] = useState({
        dob: '', documentType: '', documentNumber: '',
        bankName: '', ifsc: '', accountNo: '', confirmAccountNo: '', 
        agreedStep1: false, agreedStep2: false, agreedFinal: false,
    });

    const [files, setFiles] = useState<Record<string, File | string | null>>({
        idCardFront: null, idCardBack: null, bankPassbook: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [activePreview, setActivePreview] = useState<{ file?: File, url: string, type: 'image' | 'pdf' } | null>(null);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
                documentType: initialData.documentType || '',
                documentNumber: initialData.documentNumber || '',
                bankName: initialData.bankName || '',
                ifsc: initialData.ifsc || '',
                accountNo: initialData.accountNo || '',
                confirmAccountNo: initialData.accountNo || '',
                agreedStep1: true, agreedStep2: true, agreedFinal: true,
            });
            setFiles({
                idCardFront: initialData.idCardFront || null,
                idCardBack: initialData.idCardBack || null,
                bankPassbook: initialData.bankPassbook || null,
            });
            setActiveStep(2);
        }
    }, [initialData]);

    const handleFieldChange = (key: string, val: any) => {
        setForm(p => ({ ...p, [key]: val }));
        if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
    };

    const handleFileSelect = (key: string, file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            setErrors(p => ({ ...p, [key]: 'File must be under 5 MB' }));
            return;
        }
        setErrors(p => ({ ...p, [key]: '' }));
        setFiles(p => ({ ...p, [key]: file }));
    };

    const handleRemoveFile = (key: string) => {
        if (activePreview?.file === (files[key] as File)) setActivePreview(null);
        setFiles(p => ({ ...p, [key]: null }));
    };

    const handlePreviewFile = async (fileOrPublicId: File | string) => {
        if (!fileOrPublicId) return;
        
        if (typeof fileOrPublicId === 'string') {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const url = `${baseUrl}/kyc/files/${fileOrPublicId}`;
            
            const hasExtension = fileOrPublicId.includes('.');
            if (hasExtension) {
                setActivePreview({ url, type: fileOrPublicId.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image' });
                return;
            }

            try {
                const resp = await fetch(url, { method: 'HEAD', credentials: 'include' });
                const contentType = resp.headers.get('content-type');
                const isPdf = contentType?.toLowerCase().includes('pdf');
                setActivePreview({ url, type: isPdf ? 'pdf' : 'image' });
            } catch (err) {
                console.error("Failed to detect file type:", err);
                setActivePreview({ url, type: 'image' });
            }
        } else {
            const url = URL.createObjectURL(fileOrPublicId);
            setActivePreview({ file: fileOrPublicId, url, type: fileOrPublicId.type.includes('image') ? 'image' : 'pdf' });
        }
    };

    const handleNext = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (activeStep === 0) {
            const newErrs: Record<string, string> = {};
            const dobErr = validateDob(form.dob);
            if (dobErr) newErrs.dob = dobErr;
            if (!form.documentType) newErrs.documentType = "Required";
            const docErr = validateDocumentNumber(form.documentType, form.documentNumber);
            if (docErr) newErrs.documentNumber = docErr;
            if (!form.bankName) newErrs.bankName = "Required";
            const ifscErr = validateIfsc(form.ifsc);
            if (ifscErr) newErrs.ifsc = ifscErr;
            const accErr = validateAccountNumber(form.accountNo);
            if (accErr) newErrs.accountNo = accErr;
            if (form.accountNo !== form.confirmAccountNo) newErrs.confirmAccountNo = "No match";
            if (!form.agreedStep1) newErrs.agreedStep1 = "Required";
            if (Object.keys(newErrs).length > 0) { setErrors(newErrs); return; }
        }
        
        if (activeStep === 1) {
            const newErrs: Record<string, string> = {};
            if (!files.idCardFront) newErrs.idCardFront = "Required";
            if (!files.idCardBack) newErrs.idCardBack = "Required";
            if (!files.bankPassbook) newErrs.bankPassbook = "Required";
            if (!form.agreedStep2) newErrs.agreedStep2 = "Required";
            if (Object.keys(newErrs).length > 0) { setErrors(newErrs); return; }
        }

        setActiveStep(s => s + 1);
        const container = document.getElementById('kyc-scroll-container');
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (activeStep === 0) onBack();
        else { 
            setActiveStep(s => s - 1); 
            const container = document.getElementById('kyc-scroll-container');
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (!form.agreedFinal) {
            setErrors(p => ({ ...p, agreedFinal: "Accept policy to submit." }));
            return;
        }

        const fd = new FormData();
        const { confirmAccountNo, agreedStep1, agreedStep2, agreedFinal, ...rest } = form;
        fd.append('data', JSON.stringify(rest));
        if (files.idCardFront instanceof File) fd.append('idCardFront', files.idCardFront);
        if (files.idCardBack instanceof File) fd.append('idCardBack', files.idCardBack);
        if (files.bankPassbook instanceof File) fd.append('bankPassbook', files.bankPassbook);
        
        try { 
            await submitKyc(fd).unwrap(); 
            onSuccess();
        } catch { /* error handled by UI */ }
    };

    if (isSuccess) return null;

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0: return <IdentityStep userName={user?.name || ''} form={form} errors={errors} onFieldChange={handleFieldChange} config={config} />;
            case 1: return <UploadStep files={files} errors={errors} onFileSelect={handleFileSelect} onRemoveFile={handleRemoveFile} onPreviewFile={handlePreviewFile} agreed={form.agreedStep2} onAgreedChange={(v) => handleFieldChange('agreedStep2', v)} />;
            case 2: return <ReviewStep isReviewOnly={!!initialData} user={user} form={form} files={files} errors={errors} onPreviewFile={handlePreviewFile} onOpenPolicy={() => setIsPolicyModalOpen(true)} onAgreedChange={(v) => handleFieldChange('agreedFinal', v)} config={config} />;
            default: return null;
        }
    };

    const isSubmitted = !!initialData;

    return (
        <Card variant="outlined" sx={{ 
            height: { xs: 'auto', md: 'calc(100vh - 160px)' },
            minHeight: { md: 600 },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Global Header & Stepper (Full Width) */}
            <Box sx={{ flexShrink: 0, zIndex: 10 }}>
                {/* Header / Breadcrumbs */}
                <Box sx={{ px: { xs: 4, md: 8 }, pt: 4, pb: isSubmitted ? 4 : 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ '& .MuiBreadcrumbs-separator': { mx: 1 } }}>
                        <Typography variant="body2" fontWeight={500} color="text.secondary">KYC form</Typography>
                        <Typography variant="body2" fontWeight={800} color="text.primary">
                            {isSubmitted ? "Submitted Details" : STEPS[activeStep]}
                        </Typography>
                    </Breadcrumbs>
                    <IconButton onClick={onBack} size="small" sx={{ bgcolor: 'action.hover' }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                </Box>

                {!isSubmitted && (
                    <>
                        {/* Stepper (Horizontal) */}
                        <Box sx={{ px: { xs: 4, md: 8, lg: 12 }, pt: 1, pb: 4 }}>
                            <Stepper activeStep={activeStep} alternativeLabel sx={{
                                '& .MuiStepLabel-label': { mt: 1, fontWeight: 700, fontSize: '0.75rem', opacity: 0.6 },
                                '& .MuiStepLabel-label.Mui-active': { opacity: 1 },
                                '& .MuiStepIcon-root': { width: 32, height: 32 },
                                '& .MuiStepConnector-line': { borderTopWidth: 2 }
                            }}>
                                {STEPS.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                        <Divider sx={{ opacity: 0.1, mx: { xs: 4, md: 8 } }} />
                    </>
                )}
            </Box>

            {/* Main Content Split Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left Column: Form Content */}
                <Box id="kyc-scroll-container" sx={{ 
                    flex: activePreview ? { md: '0 0 35%', lg: '0 0 30%' } : '1 1 100%', 
                    overflowY: 'auto', 
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRight: activePreview ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    alignItems: 'center',
                }}>
                    <Box sx={{ 
                        width: '100%', 
                        maxWidth: activePreview ? '100%' : '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        transition: 'max-width 0.3s ease'
                    }}>
                        <Box sx={{ p: { xs: 4, md: activePreview ? 4 : 6, lg: activePreview ? 4 : 8 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ flexGrow: 1 }}>
                            {isSubmitted && (
                                <Alert 
                                    severity={initialData?.kycStatus?.toLowerCase() === 'approved' ? 'success' : 'info'} 
                                    icon={initialData?.kycStatus?.toLowerCase() === 'approved' ? undefined : <DocIcon />}
                                    sx={{ 
                                        mb: 6, 
                                        py: 2,
                                        '& .MuiAlert-message': { width: '100%' }
                                    }}
                                >
                                    <Typography variant="subtitle2" fontWeight={900}>
                                        {initialData?.kycStatus?.toLowerCase() === 'approved' ? 'KYC Verification Successful' : 'KYC Under Verification'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                        {initialData?.kycStatus?.toLowerCase() === 'approved' 
                                            ? 'Your account is fully verified. You can now access all premium features.' 
                                            : 'We are currently reviewing your documents. You will be notified via email once the process is complete.'}
                                    </Typography>
                                </Alert>
                            )}
                            {submitError && (
                                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                                    {'data' in submitError ? (submitError.data as any).message : 'Submission failed.'}
                                </Alert>
                            )}
                            {renderStepContent(activeStep)}
                        </Box>

                        {!isSubmitted && (
                            <>
                                {/* Navigation Buttons */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <ButtonWithIcon 
                                        text="Go Back" 
                                        icon={ArrowBackIcon} 
                                        side="left" 
                                        onClick={handleBack} 
                                        disabled={activeStep === 0 && !initialData} 
                                        variant="text"
                                        sx={{ color: 'text.secondary', fontWeight: 700 }}
                                    />
                                    {activeStep === STEPS.length - 1 ? (
                                        !initialData && (
                                            <ButtonWithIcon 
                                                text={isSubmitting ? "Submitting..." : "Submit Application"} 
                                                icon={SendIcon} 
                                                onClick={handleSubmit} 
                                                disabled={isSubmitting}
                                                variant="contained"
                                            />
                                        )
                                    ) : (
                                        <ButtonWithIcon 
                                            text="Submit And Next" 
                                            icon={ArrowForwardIcon} 
                                            onClick={handleNext} 
                                            variant="contained"
                                        />
                                    )}
                                </Box>
                            </>
                        )}
                        </Box> 
                    </Box> 
                </Box> 

                {/* Right Column: Preview Area */}
                <Box sx={{ 
                    flex: activePreview ? { md: '0 0 65%', lg: '0 0 70%' } : '0 0 0%', 
                    width: activePreview ? { md: '65%', lg: '70%' } : '0%',
                    bgcolor: '#1a1d17', 
                    display: { xs: 'none', md: activePreview ? 'flex' : 'none' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: activePreview ? 0 : 0,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                }}>
                    <DocumentViewer 
                        documents={activePreview ? [{ uri: activePreview.url, fileName: activePreview.file?.name, fileType: activePreview.type }] : []} 
                    />
                    {activePreview && (
                        <IconButton 
                            onClick={() => setActivePreview(null)}
                            sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }, zIndex: 10 }}
                            size="small"
                        >
                            <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </Box>

            {/* Mobile Preview Modal */}
            <KycPreviewModal 
                open={Boolean(activePreview) && isMobile} 
                onClose={() => setActivePreview(null)} 
                previewFile={activePreview} 
            />

            {/* Policy Modal */}
            <KycPolicyModal 
                open={isPolicyModalOpen} 
                onClose={() => setIsPolicyModalOpen(false)} 
                policyText={policyData?.policy || (policyData as any)?.data?.policy || ''} 
                isLoading={isLoadingPolicy} 
                onAccept={() => handleFieldChange('agreedFinal', true)} 
            />
        </Card>
    );
};

export default KycContainer;
