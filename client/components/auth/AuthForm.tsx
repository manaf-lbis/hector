'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

import UserIdentifierForm from './UserIdentifierForm';
import OTPForm from './OTPForm';

import {
  useInitiateLoginMutation,
  useInitiateSignupMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '@/store/api/auth.api';
import { loginSuccess } from '@/store/slices/auth.slice';
import { useDispatch } from 'react-redux';

type AuthType = 'login' | 'signup';

export default function AuthForm({ type }: { type: AuthType }) {
  const dispatch = useDispatch();
  const router = useRouter();

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

  const [initiateLogin, { isLoading: isInitiatingLogin }] = useInitiateLoginMutation();
  const [initiateSignup, { isLoading: isInitiatingSignup }] = useInitiateSignupMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

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
        setOtpChannel(formData.email || formData.phone || 'your contact');
      } else {
        await initiateLogin({
          identifier: formData.identifier.trim(),
        }).unwrap();
        setOtpChannel(formData.identifier);
      }
      setStep(2);
    } catch (err: any) {
      setApiError(err?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerify = async () => {
    if (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
      setApiError('Please enter a valid 6-digit code');
      return;
    }

    setApiError('');

    try {
      let payload: any;

      if (isSignup) {
        payload = {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          otp: formData.otp.trim(),
        };
      } else {
        payload = {
          identifier: formData.identifier.trim(),
          otp: formData.otp.trim(),
        };
      }

      const response = await verifyOtp(payload).unwrap();
      const user = response.user ?? response;

      dispatch(loginSuccess(user));
      router.replace('/');
    } catch (err: any) {
      setApiError(err?.data?.message || 'Invalid or expired OTP');
    }
  };

  const handleResend = async () => {
    setApiError('');

    try {
      const target = isSignup ? formData.email.trim() : formData.identifier.trim();
      await resendOtp({ identifier: target }).unwrap();
    } catch (err: any) {
      setApiError(err?.data?.message || 'Failed to resend code');
    }
  };

  const isLoadingStep1 = isInitiatingLogin || isInitiatingSignup;

  return (
    <Box sx={{ width: { xs: '90vw', sm: 420 }, mx: 'auto', p: 4, position: 'relative' }}>
      <IconButton onClick={() => router.back()} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
        {isSignup ? 'Create Account' : 'Sign In'}
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
        {step === 2
          ? `Code sent to ${otpChannel}`
          : isSignup
          ? 'Join in less than a minute'
          : 'Use your email or phone number'}
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setApiError('')}>
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