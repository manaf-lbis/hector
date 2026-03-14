export const validateFullName = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required";
  if (trimmed.length < 2) return "Name is too short";
  if (trimmed.length > 50) return "Name is too long";
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, hyphens and apostrophes";
  }
  return null;
};

export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Please enter a valid email address";
  if (trimmed.length > 254) return "Email is too long";
  return null;
};

export const validatePhone = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Phone number is required";
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(trimmed)) {
    return "Enter a valid 10 digit phone number";
  }

  return null;
};

export const validateEmailOrPhone = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Email or phone number is required";

  if (trimmed.includes('@')) {
    return validateEmail(trimmed);
  }
  return validatePhone(trimmed);
};

export const validateOTP = (value: string): string | null => {
  if (value.length === 0) return "Please enter the code";
  if (value.length !== 6) return "Code must be 6 digits";
  if (!/^\d{6}$/.test(value)) return "Code must contain only numbers";
  return null;
};