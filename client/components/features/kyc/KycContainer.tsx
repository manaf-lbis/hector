"use client";

import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, IconButton, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSubmitKycMutation, useGetPrivacyPolicyQuery } from '@/store/api/kyc.api';
import ButtonWithIcon from '@/components/ui/ButtonWithIcon';
import { validateDob, validateDocumentNumber, validateIfsc, validateAccountNumber } from '@/utils/validators/kycValidator';

// Components
import IdentityStep from './steps/IdentityStep';
import UploadStep from './steps/UploadStep';
import ReviewStep from './steps/ReviewStep';
import KycPreviewModal from './ui/KycPreviewModal';
import KycPolicyModal from './ui/KycPolicyModal';

// Constants
const STEPS = ['Identity Details', 'Upload Documents', 'Review Submission'];

interface KycContainerProps {
    user: any;
    initialData?: any;
    onSuccess: () => void;
    config: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
}

const KycContainer: React.FC<KycContainerProps> = ({ user, initialData, onSuccess, config }) => {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [submitKyc, { isLoading, isSuccess, error: submitError }] = useSubmitKycMutation();
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
    
    // Modal state
    const [previewFile, setPreviewFile] = useState<{ file?: File, url: string, type: 'image' | 'pdf' } | null>(null);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

    // Load initial data if provided (for viewing/re-submitting)
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
            setActiveStep(2); // Start at review step
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
        setFiles(p => ({ ...p, [key]: null }));
    };

    const handlePreviewFile = (fileOrPublicId: File | string) => {
        if (typeof fileOrPublicId === 'string') {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const url = `${baseUrl}/kyc/files/${fileOrPublicId}`;
            setPreviewFile({ url, type: fileOrPublicId.toLowerCase().includes('pdf') ? 'pdf' : 'image' });
        } else {
            const url = URL.createObjectURL(fileOrPublicId);
            setPreviewFile({ file: fileOrPublicId, url, type: fileOrPublicId.type.includes('image') ? 'image' : 'pdf' });
        }
    };

    const closePreview = () => {
        if (previewFile && !previewFile.file) {
            // No action needed for string URLs
        } else if (previewFile?.url) {
            URL.revokeObjectURL(previewFile.url);
        }
        setPreviewFile(null);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (activeStep === 0) router.back();
        else { setActiveStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
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

    if (isSuccess) return null; // Parent will handle view change

    const renderStep = () => {
        switch (activeStep) {
            case 0: return <IdentityStep userName={user?.name || ''} form={form} errors={errors} onFieldChange={handleFieldChange} config={config} />;
            case 1: return <UploadStep files={files} errors={errors} onFileSelect={handleFileSelect} onRemoveFile={handleRemoveFile} onPreviewFile={handlePreviewFile} agreed={form.agreedStep2} onAgreedChange={(v) => handleFieldChange('agreedStep2', v)} />;
            case 2: return <ReviewStep user={user} form={form} files={files} errors={errors} onPreviewFile={handlePreviewFile} onOpenPolicy={() => setIsPolicyModalOpen(true)} onAgreedChange={(v) => handleFieldChange('agreedFinal', v)} config={config} />;
            default: return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 6 } }}>
            {/* Sidebar Stepper */}
            <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 240, lg: 280 } }}>
                <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
                    <Stepper activeStep={activeStep} orientation="vertical" sx={{
                        '& .MuiStepLabel-label': { fontSize: { xs: '0.85rem', md: '0.9rem' } },
                        display: { xs: 'flex', md: 'block' },
                        flexDirection: { xs: 'row', md: 'column' },
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        overflowX: { xs: 'auto', md: 'visible' },
                        '& .MuiStep-root': { flexShrink: 0, px: { xs: 2, md: 0 } },
                        '& .MuiStepConnector-root': { display: { xs: 'none', md: 'block' } }
                    }}>
                        {STEPS.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>
                                    <Typography variant="body2" fontWeight={activeStep === index ? 700 : 500} color={activeStep === index ? 'primary.main' : 'text.secondary'}>
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* Content Area */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={800} color="text.primary" gutterBottom>
                        {activeStep === 0 && 'Enter identity details to verify'}
                        {activeStep === 1 && 'Upload your documents'}
                        {activeStep === 2 && 'Review and submit'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {activeStep === 0 && 'Enter valid ID card details to verify your identity'}
                        {activeStep === 1 && 'Upload clear photos or PDFs of your documents'}
                        {activeStep === 2 && 'Please review all your details and accept the privacy policy'}
                    </Typography>
                </Box>

                {submitError && (
                    <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                        {'data' in submitError ? (submitError.data as any).message : 'Submission failed.'}
                    </Alert>
                )}

                {renderStep()}

                <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', pb: { xs: 4, md: 0 } }}>
                    {activeStep < STEPS.length - 1 ? (
                        <ButtonWithIcon text="Next" icon={ArrowForwardIcon} onClick={handleNext} />
                    ) : (
                        <ButtonWithIcon
                            text={isLoading ? 'Submitting…' : 'Submit Application'}
                            icon={isLoading ? null : ArrowForwardIcon}
                            onClick={handleSubmit}
                            needAnimation={!isLoading}
                        />
                    )}
                </Box>

                <IconButton onClick={handleBack} sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 10, bgcolor: 'action.hover', display: { md: 'none' } }}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            {/* Modals */}
            <KycPreviewModal 
                open={!!previewFile} 
                onClose={closePreview} 
                previewFile={previewFile} 
            />
            <KycPolicyModal 
                open={isPolicyModalOpen} 
                onClose={() => setIsPolicyModalOpen(false)} 
                policyText={policyData?.policy || (policyData as any)?.data?.policy || ''} 
                isLoading={isLoadingPolicy} 
                onAccept={() => handleFieldChange('agreedFinal', true)} 
            />
        </Box>
    );
};

export default KycContainer;
