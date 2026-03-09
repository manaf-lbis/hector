
export const validateEmailOrPhone = (value: string) => {
  if (!value.trim()) return "Email or phone is required";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return "Invalid email or phone number";
  }
  return null;
};

export const validateFullName = (value: string) => {
  if (!value.trim() || value.trim().length < 2) return "Full name must be at least 2 characters";
  return null;
};

export const validateOTP = (value: string) => {
  if (!/^\d{6}$/.test(value.trim())) return "OTP must be exactly 6 digits";
  return null;
};