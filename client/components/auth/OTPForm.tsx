import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { validateOTP } from "@/utils/validators/formValidator";

interface OTPProps {
    form: { otp: string };
    setForm: React.Dispatch<React.SetStateAction<any>>;
    onBack: () => void;
}

const OTPForm = ({ form, setForm, onBack }: OTPProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleVerify = () => {
        const otpError = validateOTP(form.otp);
        if (otpError) {
            setError(otpError);
            return;
        }
        // If valid, trigger your API/Auth logic here
        console.log("Final submission with OTP:", form.otp);
    };

    return (
        <>
            <TextField 
                label="Enter 6-Digit OTP" 
                variant="filled" 
                fullWidth 
                name="otp"
                value={form.otp}
                onChange={(e) => {
                    setForm((prev: any) => ({ ...prev, otp: e.target.value }));
                    if (error) setError(null);
                }}
                error={!!error}
                helperText={error}
                inputProps={{ 
                    maxLength: 6, 
                    style: { textAlign: 'center', letterSpacing: '0.5em' } 
                }} 
            />
            <Button variant="contained" size="large" onClick={handleVerify}>
                Verify OTP
            </Button>
            <Button variant="text" onClick={onBack}>Back</Button>
        </>
    );
};

export default OTPForm;