'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Alert, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

import UserIdentifierForm from './UserIdentifierForm';
import OTPForm from './OTPForm';
import Logo from '../ui/Logo';
import { validateEmail, validateFullName, validatePhone } from '@/utils/validators/formValidator';

import {
  useInitiateLoginMutation,
  useInitiateSignupMutation,
  useResendSignupOtpMutation,
  useResendLoginOtpMutation,
  useVerifyLoginOtpMutation,
  useVerifySignupOtpMutation,
} from '@/store/api/auth.api';

import { loginSuccess } from '@/store/slices/auth.slice';
import { useAppDispatch } from '@/store/hooks';
import { authApi } from '@/store/api/auth.api';

type AuthType = 'login' | 'signup';

interface AuthFormProps {
  type: AuthType;
  isModal?: boolean;
}

export default function AuthForm({ type, isModal = false }: AuthFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();

  const isSignup = type === 'signup';

  const [step, setStep] = useState<1 | 2>(1);
  const [apiError, setApiError] = useState<string>('');

  const [otpChannel, setOtpChannel] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    identifier: '',
    otp: '',
  });

  const [initiateSignup, { isLoading: isInitiatingSignup }] = useInitiateSignupMutation();
  const [verifySignupOtp, { isLoading: isVerifyingSignup }] = useVerifySignupOtpMutation();
  const [resendSignupOtp, { isLoading: isResendingSignup }] = useResendSignupOtpMutation();

  const [initiateLogin, { isLoading: isInitiatingLogin }] = useInitiateLoginMutation();
  const [verifyLoginOtp, { isLoading: isVerifyingLogin }] = useVerifyLoginOtpMutation();
  const [resendLoginOtp, { isLoading: isResendingLogin }] = useResendLoginOtpMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError('');
  };

  const handleRequestOtp = async () => {
    setApiError('');

    try {
      if (isSignup) {
        await initiateSignup({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }).unwrap();

        setOtpChannel(`${formData.email} / ${formData.phone}`);
      } else {
        await initiateLogin({
          identifier: formData.identifier.trim(),
        }).unwrap();

        setOtpChannel(formData.identifier);
      }
      setStep(2);
    } catch (err: any) {
      setApiError(err?.data?.message || 'Failed to request code. Try again.');
    }
  };

  const handleVerify = async () => {
    if (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
      setApiError('Enter a valid 6-digit code');
      return;
    }

    setApiError('');

    try {
      let response;

      if (isSignup) {
        response = await verifySignupOtp({
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          otp: formData.otp.trim(),
        }).unwrap();
      } else {
        response = await verifyLoginOtp({
          identifier: formData.identifier.trim(),
          otp: formData.otp.trim(),
        }).unwrap();
      }

      const user = response.data ?? response.user ?? response;
      
      // Trigger a direct /me fetch to get full data (location, KYC status)
      const fullUser = await dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })).unwrap();

      dispatch(loginSuccess(fullUser.data || fullUser));

      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (isModal) {
        router.back();
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setApiError(err?.data?.message || 'Invalid or expired code');
    }
  };

  const handleResend = async () => {
    setApiError('');

    try {
      if (isSignup) {
        await resendSignupOtp({
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }).unwrap();
      } else {
        await resendLoginOtp({
          identifier: formData.identifier.trim(),
        }).unwrap();
      }
    } catch (err: any) {
      setApiError(err?.data?.message || 'Failed to resend code');
    }
  };

  const isLoadingStep1 = isInitiatingLogin || isInitiatingSignup;
  const isVerifying = isVerifyingSignup || isVerifyingLogin;
  const isResending = isResendingSignup || isResendingLogin;

  return (
    <Box sx={{ width: '100%', maxWidth: 420, minWidth: { sm: 400 }, minHeight: 400, mx: 'auto', p: isModal ? 4 : { xs: 2, sm: 4 }, position: 'relative' }}>
      {isModal && (
        <IconButton onClick={() => router.back()} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Logo navigateTo="/" />
      </Box>

      <Typography variant="h5" fontWeight={800} align="center" gutterBottom sx={{ color: 'text.primary' }}>
        {isSignup ? 'Create your account!' : 'Login to your account!'}
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        {step === 2
          ? `Code sent to ${otpChannel}`
          : isSignup
            ? 'Join in less than a minute. Enter your details below.'
            : 'Enter your registered email address or phone number to login!'}
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }} onClose={() => setApiError('')}>
          {apiError}
        </Alert>
      )}

      {step === 1 ? (
        <UserIdentifierForm
          type={type}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleRequestOtp}
          isLoading={isLoadingStep1}
        />
      ) : (
        <OTPForm
          otp={formData.otp}
          onOtpChange={(val) => setFormData((p) => ({ ...p, otp: val }))}
          onVerify={handleVerify}
          onBack={() => setStep(1)}
          onResend={handleResend}
          isVerifying={isVerifying}
          isResending={isResending}
        />
      )}
    </Box>
  );
}