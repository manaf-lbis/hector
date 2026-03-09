'use client';

import { useState } from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import UserIdentifierForm from './UserIdentifierForm';
import OTPForm from './OTPForm';
import { validateEmailOrPhone, validateFullName } from '@/utils/validators/formValidator';


export const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    identifier: '',
    otp: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    identifier: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    const newErrors = { fullName: '', email: '', phone: '', identifier: '' };
    let hasError = false;

    if (type === 'signup') {
      const nameErr = validateFullName(form.fullName);
      const emailErr = validateEmailOrPhone(form.email); 
      const phoneErr = validateEmailOrPhone(form.phone);

      if (nameErr) { newErrors.fullName = nameErr; hasError = true; }
      if (emailErr) { newErrors.email = emailErr; hasError = true; }
      if (phoneErr) { newErrors.phone = phoneErr; hasError = true; }
    } else {
      const idErr = validateEmailOrPhone(form.identifier);
      if (idErr) { newErrors.identifier = idErr; hasError = true; }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setStep(2);
  };

  return (
    <Box sx={{
      width: { xs: '90vw', sm: 400 },
      p: { xs: 3, sm: 4 },
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      position: 'relative'
    }}>
      <IconButton onClick={() => router.back()} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" fontWeight="700" textAlign="center" sx={{ mt: 2 }}>
        {type === 'login' ? 'Welcome Back' : 'Create Account'}
      </Typography>

      <Stack spacing={2.5}>
        {step === 1 ? (
          <UserIdentifierForm
            type={type}
            form={form} 
            errors={errors}
            onChange={handleChange}
            onNext={handleNextStep}
          />
        ) : (
          <OTPForm
            form={form}
            setForm={setForm}
            onBack={() => setStep(1)}
          />
        )}
      </Stack>
    </Box>
  );
};