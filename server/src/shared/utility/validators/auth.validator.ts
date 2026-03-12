import ApiError from "../api.error";

export const validateFullName = (value: string): void => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new ApiError("Full name is required", 400);
  }
  if (trimmed.length < 2) {
    throw new ApiError("Name is too short (minimum 2 characters)", 400);
  }
  if (trimmed.length > 50) {
    throw new ApiError("Name is too long (maximum 50 characters)", 400);
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    throw new ApiError(
      "Name can only contain letters, spaces, hyphens and apostrophes",
      400
    );
  }
};

export const validateEmail = (value: string): void => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new ApiError("Email is required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    throw new ApiError("Please enter a valid email address", 400);
  }

  if (trimmed.length > 254) {
    throw new ApiError("Email is too long", 400);
  }
};

export const validatePhone = (value: string): void => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new ApiError("Phone number is required", 400);
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(trimmed)) {
    throw new ApiError("Enter a valid 10-digit Indian phone number starting with 6-9", 400);
  }
};

export const validateEmailOrPhone = (value: string): void => {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new ApiError("Email or phone number is required", 400);
  }

  if (trimmed.includes("@")) {
    validateEmail(trimmed);
  } else {
    validatePhone(trimmed);
  }
};

export const validateOTP = (value: string): void => {
  if (value.length === 0) {
    throw new ApiError("Please enter the OTP code", 400);
  }
  if (value.length !== 6) {
    throw new ApiError("OTP must be exactly 6 digits", 400);
  }
  if (!/^\d{6}$/.test(value)) {
    throw new ApiError("OTP must contain only numbers", 400);
  }
};