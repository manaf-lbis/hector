import { Stack, TextField, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { validateFullName, validateEmailOrPhone } from '@/utils/validators/formValidator';

type Props = {
  type: 'login' | 'signup';
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export default function UserIdentifierForm({ type, formData, onChange, onSubmit, isLoading }: Props) {
  const router = useRouter();
  const isSignup = type === 'signup';
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const getErrors = () => {
    const err: Record<string, string> = {};

    if (isSignup) {
      const nameErr = validateFullName(formData.fullName);
      if (nameErr) err.fullName = nameErr;

      const emailErr = validateEmailOrPhone(formData.email);
      if (emailErr) err.email = emailErr;

      if (!formData.phone?.trim()) {
        err.phone = 'Phone number is required';
      } else {
        const phoneErr = validateEmailOrPhone(formData.phone);
        if (phoneErr) err.phone = phoneErr;
      }
    } else {
      const idErr = validateEmailOrPhone(formData.identifier);
      if (idErr) err.identifier = idErr;
    }

    return err;
  };

  const currentErrors = getErrors();
  const hasError = Object.keys(currentErrors).length > 0;

  const visibleErrors = attemptedSubmit ? currentErrors : {};

  const handleClick = () => {
    setAttemptedSubmit(true);
    if (!hasError) {
      onSubmit();
    }
  };

  return (
    <Stack >
      {isSignup ? (
        <>
          <TextField
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={onChange}
            error={!!visibleErrors.fullName}
            helperText={visibleErrors.fullName || ' '}
            variant="outlined"
            fullWidth
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={onChange}
            error={!!visibleErrors.email}
            helperText={visibleErrors.email || ' '}
            variant="outlined"
            fullWidth
          />
          <TextField
            name="phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            error={!!visibleErrors.phone}
            helperText={visibleErrors.phone || ' '}
            variant="outlined"
            fullWidth
          />
        </>
      ) : (
        <TextField
          name="identifier"
          label="Email or Phone Number"
          value={formData.identifier}
          onChange={onChange}
          error={!!visibleErrors.identifier}
          helperText={visibleErrors.identifier || ' '}
          variant="outlined"
          fullWidth
          autoFocus
        />
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Get OTP'}
      </Button>

      <Typography variant="body2" align="center" color="text.secondary">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Button
          variant="text"
          onClick={() => router.replace(isSignup ? '/auth/login' : '/auth/signup')}
        >
          {isSignup ? 'Sign in' : 'Sign up'}
        </Button>
      </Typography>
    </Stack>
  );
}