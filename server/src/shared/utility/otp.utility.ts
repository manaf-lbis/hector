import ApiError from "./api.error";

export const generateOTP = (length: number = 6): string => {
  if (length < 4 || length > 10) {
    throw new ApiError("OTP length should be between 4 and 10 digits");
  }
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};
