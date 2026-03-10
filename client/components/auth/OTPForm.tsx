// src/components/auth/OTPForm.tsx
import { Stack, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import Timer from '../ui/Timer';

import { validateOTP } from '@/utils/validators/formValidator';   // ← import it

type Props = {
  otp: string;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onBack: () => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
};

export default function OTPForm({
  otp,
  onOtpChange,
  onVerify,
  onBack,
  onResend,
  isVerifying,
  isResending,
}: Props) {
  const [attemptedVerify, setAttemptedVerify] = useState(false);

  const numericOtp = otp.replace(/\D/g, '').slice(0, 6);

  // Run validator
  const otpError = validateOTP(numericOtp);

  // Show error only after first attempt
  const visibleOtpError = attemptedVerify && otpError ? otpError : '';

  const handleVerifyClick = () => {
    setAttemptedVerify(true);

    if (!otpError) {
      onVerify();     // only call real API if valid
    }
    // else → show error, do NOT send request
  };

  return (
    <Stack spacing={3}>
      <TextField
        label="Enter 6-digit OTP"
        variant="outlined"
        fullWidth
        value={numericOtp}
        onChange={(e) => onOtpChange(e.target.value)}
        inputProps={{
          maxLength: 6,
          style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.4rem' },
        }}
        autoFocus
        disabled={isVerifying}
        error={!!visibleOtpError}
        helperText={visibleOtpError || 'Check your email or SMS'}
      />

      <Timer
        seconds={60}
        onResend={onResend}
        loading={isResending}
        size="medium"
      />

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleVerifyClick}
        disabled={isVerifying || numericOtp.length < 6}
      >
        {isVerifying ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1.5 }} />
            Verifying...
          </>
        ) : (
          'Verify & Continue'
        )}
      </Button>

      <Button variant="text" onClick={onBack} fullWidth>
        Back to details
      </Button>
    </Stack>
  );
}