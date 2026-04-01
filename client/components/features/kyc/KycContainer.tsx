"use client";

import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, IconButton, Alert, alpha, Card, Divider, Grid, Breadcrumbs, Link as MuiLink, useMediaQuery, useTheme, Button } from '@mui/material';
import { BOX_VARIANTS } from '@/app/theme';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon, Send as SendIcon, NavigateNext as NavigateNextIcon, Description as DocIcon, Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSubmitKycMutation, useGetPrivacyPolicyQuery } from '@/store/api/kyc.api';
import ButtonWithIcon from '@/components/ui/ButtonWithIcon';
import { validateDob, validateDocumentNumber, validateIfsc, validateAccountNumber, validateFile, validatePincode } from '@/utils/validators/kycValidator';

import IdentityStep from './steps/IdentityStep';
import AddressStep from './steps/AddressStep';
import UploadStep from './steps/UploadStep';
import ReviewStep from './steps/ReviewStep';
import KycPreviewModal from './ui/KycPreviewModal';
import KycPolicyModal from './ui/KycPolicyModal';
import ImageCropperModal from '@/components/ui/ImageCropperModal';
import DocumentViewer from '@/components/ui/DocumentViewer';
import KycStatusAlert from './ui/KycStatusAlert';

const STEPS = ['Identity Details', 'Address Details', 'Upload Documents', 'Final Review'];

interface KycContainerProps {
    user: any;
    initialData?: any;
    onSuccess: () => void;
    onBack: () => void;
    config: {
        DOCUMENT_TYPES: { value: string, label: string }[];
        MAJOR_BANKS: string[];
    };
    isAdmin?: boolean;
    isEditing?: boolean;
    onEdit?: () => void;
    isViewing?: boolean;
    onView?: () => void;
    isSubmittingSuccess?: boolean;
    kycStatusReason?: string;
}

const KycContainer: React.FC<KycContainerProps> = ({
    user, initialData, onSuccess, onBack, config,
    isAdmin = false, isEditing: isEditingProp, onEdit,
    isViewing = false, onView,
    isSubmittingSuccess = false, kycStatusReason = ''
}) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeStep, setActiveStep] = useState(0);
    const [submitKyc, { isLoading: isSubmitting, isSuccess, error: submitError }] = useSubmitKycMutation();
    const { data: policyData, isLoading: isLoadingPolicy } = useGetPrivacyPolicyQuery();

    const [form, setForm] = useState({
        dob: '', documentType: '', documentNumber: '',
        bankName: '', ifsc: '', accountNo: '', confirmAccountNo: '',
        location: '', state: '', district: '', taluk: '', pincode: '',
        agreedStep1: false, agreedStep2: false, agreedFinal: false,
        userName: user?.name || user?.email?.split('@')[0] || ''
    });

    const [files, setFiles] = useState<Record<string, File | string | null>>({
        idCardFront: null, idCardBack: null, bankPassbook: null, profilePicture: null
    });

    const [cropper, setCropper] = useState<{ open: boolean, imageSrc: string }>({ open: false, imageSrc: '' });

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
                location: initialData.location || '',
                state: initialData.state || '',
                district: initialData.district || '',
                taluk: initialData.taluk || '',
                pincode: initialData.pincode || '',
                agreedStep1: true, agreedStep2: true, agreedFinal: true,
                userName: initialData.user?.name || user?.name || user?.email?.split('@')[0] || ''
            });
            setFiles({
                idCardFront: initialData.idCardFront || null,
                idCardBack: initialData.idCardBack || null,
                bankPassbook: initialData.bankPassbook || null,
                profilePicture: initialData.profilePicture || null,
            });
            setActiveStep(3);
        }
    }, [initialData]);

    const handleFieldChange = (key: string, val: any) => {
        setForm(p => ({ ...p, [key]: val }));
        if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
    };

    const handleFileSelect = (key: string, file: File) => {
        const fileErr = validateFile(file);
        if (fileErr) {
            setErrors(p => ({ ...p, [key]: fileErr }));
            return;
        }
        setErrors(p => ({ ...p, [key]: '' }));
        setFiles(p => ({ ...p, [key]: file }));
    };

    const handleRemoveFile = (key: string) => {
        if (activePreview?.file === (files[key] as File)) setActivePreview(null);
        setFiles(p => ({ ...p, [key]: null }));
    };

    const handleProfilePicSelect = (file: File) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(p => ({ ...p, profilePicture: 'Only JPG, JPEG, and PNG are allowed' }));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
            setCropper({ open: true, imageSrc: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        const file = new File([croppedBlob], "profile_picture.jpg", { type: "image/jpeg" });
        setFiles(p => ({ ...p, profilePicture: file }));
        setCropper({ open: false, imageSrc: '' });
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
            if (!form.userName) newErrs.userName = "Required";
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
            if (!form.location?.trim()) newErrs.location = "Required";
            if (!form.state?.trim()) newErrs.state = "Required";
            if (!form.district?.trim()) newErrs.district = "Required";
            if (!form.taluk?.trim()) newErrs.taluk = "Required";
            const pinErr = validatePincode(form.pincode);
            if (pinErr) newErrs.pincode = pinErr;
            if (Object.keys(newErrs).length > 0) { setErrors(newErrs); return; }
        }

        if (activeStep === 2) {
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
        if (files.profilePicture instanceof File) fd.append('profilePicture', files.profilePicture);

        try {
            await submitKyc(fd).unwrap();
            onSuccess();
        } catch { /* error handled by UI */ }
    };


    const renderStepContent = (step: number) => {
        switch (step) {
            case 0: return <IdentityStep userName={form.userName} form={form} errors={errors} onFieldChange={handleFieldChange} config={config} />;
            case 1: return <AddressStep form={form} errors={errors} onFieldChange={handleFieldChange} />;
            case 2: return <UploadStep files={files} errors={errors} onFileSelect={handleFileSelect} onProfilePicSelect={handleProfilePicSelect} onRemoveFile={handleRemoveFile} onPreviewFile={handlePreviewFile} agreed={form.agreedStep2} onAgreedChange={(v) => handleFieldChange('agreedStep2', v)} />;
            case 3: return <ReviewStep isReviewOnly={!!initialData} status={kycStatus} user={user} form={form} files={files} errors={errors} onPreviewFile={handlePreviewFile} onOpenPolicy={() => setIsPolicyModalOpen(true)} onAgreedChange={(v) => handleFieldChange('agreedFinal', v)} config={config} />;
            default: return null;
        }
    };

    const kycStatus = initialData?.kycStatus?.toLowerCase() || 'none';
    const isReturned = kycStatus === 'returned';
    const isRejected = kycStatus === 'rejected';
    const isApproved = kycStatus === 'approved';
    const isPending = kycStatus === 'pending' || kycStatus === 'resubmitted';


    const isSubmitted = !!initialData && kycStatus !== 'none';

    const isEditing = isEditingProp !== undefined ? isEditingProp : (!isSubmitted);

    return (
        <Card variant="outlined" sx={{
            height: { xs: 'auto', md: 'calc(100vh - 200px)' },
            minHeight: { md: 600 },
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{ flexShrink: 0, zIndex: 10 }}>
                {!isAdmin && isEditing && (
                    <>
                        <Box sx={{ px: { xs: 4, md: 8, lg: 12 }, pt: 4, pb: 4 }}>
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

            <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
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
                            {!isEditing && !isSubmittingSuccess && (
                                <KycStatusAlert
                                    status={kycStatus}
                                    reason={kycStatusReason || initialData?.reason}
                                />
                            )}

                            {isSubmittingSuccess && (
                                <Alert
                                    severity="success"
                                    sx={{ mb: 4, borderRadius: 2 }}
                                    icon={<SendIcon />}
                                >
                                    <Typography variant="subtitle2" fontWeight={900}>Application Submitted Successfully</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Your documents are now being reviewed. We'll notify you once the process is complete.
                                    </Typography>
                                </Alert>
                            )}

                            {isEditing ? (
                                renderStepContent(activeStep)
                            ) : (
                                <Box sx={{ py: 4 }}>
                                    {!isAdmin && !isViewing && !isEditing && (
                                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>

                                            {isReturned && (
                                                <Button
                                                    variant="contained"
                                                    onClick={onEdit}
                                                    sx={{ borderRadius: 2, fontWeight: 800, px: 4, py: 1.5 }}
                                                >
                                                    Edit Application
                                                </Button>
                                            )}
                                            {isApproved && (
                                                <ButtonWithIcon
                                                    text="Update KYC Details (Re-eKYC)"
                                                    icon={EditIcon}
                                                    onClick={onEdit}
                                                    needAnimation={false}
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            )}
                                            {isPending && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={onView}
                                                    sx={{ borderRadius: 2, fontWeight: 800, px: 4, py: 1.5 }}
                                                >
                                                    View Application
                                                </Button>
                                            )}
                                        </Box>
                                    )}

                                    {(isViewing || (!isAdmin && isApproved)) && renderStepContent(3)}

                                    {isAdmin && (isPending || isApproved) && renderStepContent(3)}
                                </Box>
                            )}

                            {isEditing && !isAdmin && (
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <ButtonWithIcon
                                            text="Go Back"
                                            icon={ArrowBackIcon}
                                            side="left"
                                            onClick={handleBack}
                                            disabled={activeStep === 0}
                                            variant="text"
                                            sx={{ color: 'text.secondary', fontWeight: 700 }}
                                        />
                                        {activeStep === STEPS.length - 1 ? (
                                            <ButtonWithIcon
                                                text={isSubmitting ? "Submitting..." : "Submit Application"}
                                                icon={SendIcon}
                                                onClick={handleSubmit}
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                variant="contained"
                                            />
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

                            {initialData?.history && initialData.history.length > 0 && !isEditing && !isViewing && !isApproved && (
                                <Box sx={{ mt: 8, pt: 6, borderTop: '1px solid', borderColor: alpha(theme.palette.divider, 0.08) }}>
                                    <Typography variant="h6" fontWeight={900} sx={{ mb: 4, letterSpacing: '-0.02em' }}>
                                        Application History
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {initialData.history.map((h: any, i: number) => (
                                            <Box key={i} sx={{
                                                display: 'flex', gap: 2.5,
                                                position: 'relative',
                                                '&::before': i !== initialData.history.length - 1 ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: 11, top: 24, bottom: -24,
                                                    width: 2,
                                                    bgcolor: 'divider',
                                                    opacity: 0.5
                                                } : {}
                                            }}>
                                                <Box sx={{
                                                    width: 24, height: 24, borderRadius: '50%',
                                                    bgcolor: h.status === 'approved' ? 'success.main' : h.status === 'rejected' ? 'error.main' : 'primary.main',
                                                    flexShrink: 0, mt: 0.5,
                                                    zIndex: 1
                                                }} />
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                                        <Typography variant="body2" fontWeight={800} sx={{ textTransform: 'capitalize' }}>
                                                            {h.status}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.6 }}>
                                                            {new Date(h.createdAt).toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                    {h.reason && (
                                                        <Typography variant="body2" color="text.secondary" sx={{
                                                            ...BOX_VARIANTS['surface-flat'],
                                                            background: alpha(theme.palette.text.primary, 0.03),
                                                            p: 2, borderRadius: 2, mt: 1,
                                                            borderLeft: '4px solid', borderColor: alpha(theme.palette.divider, 0.2),
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {h.reason}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, opacity: 0.5 }}>
                                                        By: {h.actionByName} ({h.actionByRole})
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

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

            <KycPreviewModal
                open={Boolean(activePreview) && isMobile}
                onClose={() => setActivePreview(null)}
                previewFile={activePreview}
            />

            <KycPolicyModal
                open={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                policyText={policyData?.policy || (policyData as any)?.data?.policy || ''}
                isLoading={isLoadingPolicy}
                onAccept={() => handleFieldChange('agreedFinal', true)}
            />

            <ImageCropperModal
                open={cropper.open}
                imageSrc={cropper.imageSrc}
                onClose={() => setCropper({ ...cropper, open: false })}
                onCropComplete={handleCropComplete}
                aspectRatio={1}
            />
        </Card>
    );
};

export default KycContainer;
