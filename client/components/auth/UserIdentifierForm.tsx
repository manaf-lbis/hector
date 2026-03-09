import { Button, TextField, Typography, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

interface Props {
  type: 'login' | 'signup';
  form: { fullName: string; email: string; phone: string; identifier: string };
  errors: { fullName: string; email: string; phone: string; identifier: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

const UserIdentifierForm = ({ type, form, errors, onChange, onNext }: Props) => {
  const router = useRouter();

  return (
    <Stack spacing={2.5}>
      {type === 'signup' ? (
        <>
          <TextField 
            name="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={onChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            variant='filled' 
            fullWidth 
          />
          <TextField 
            name="email"
            label="Email Address"
            type="email"
            value={form.email}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email}
            variant='filled' 
            fullWidth 
          />
          <TextField 
            name="phone"
            label="Mobile Number"
            type="tel"
            value={form.phone}
            onChange={onChange}
            error={!!errors.phone}
            helperText={errors.phone}
            variant='filled' 
            fullWidth 
          />
        </>
      ) : (
        <TextField 
          name="identifier"
          label="Email or Phone" 
          value={form.identifier}
          onChange={onChange}
          error={!!errors.identifier}
          helperText={errors.identifier}
          variant='filled' 
          fullWidth 
        />
      )}

      <Button 
        variant="contained" 
        size="large" 
        onClick={onNext}
        sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1.1rem' }}
      >
        Get OTP
      </Button>

      <Typography variant="body2" textAlign="center" color="text.secondary">
        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
        <Button
          variant="text"
          onClick={() => router.replace(type === 'login' ? '/auth/signup' : '/auth/login')}
          sx={{ p: 0, minWidth: 'auto', fontWeight: 700, textTransform: 'none', ml: 0.5 }}
        >
          {type === 'login' ? 'Sign up' : 'Log in'}
        </Button>
      </Typography>
    </Stack>
  );
};

export default UserIdentifierForm;