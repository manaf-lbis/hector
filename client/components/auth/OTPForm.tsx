import { Stack, TextField, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';   // ← add useEffect
import Timer from '../ui/Timer';

import { validateOTP } from '@/utils/validators/formValidator';

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
  const otpError = validateOTP(numericOtp);
  const visibleOtpError = attemptedVerify && otpError ? otpError : '';

  const handleVerifyClick = () => {
    setAttemptedVerify(true);

    if (!otpError) {
      onVerify();
    }
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
        helperText={visibleOtpError || 'Check your email or SMS for the new code'}
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