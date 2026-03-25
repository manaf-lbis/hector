"use client";

import { Dialog } from "@mui/material";
import AuthForm from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onClose={() => router.back()}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: '420px',
          m: 2
        }
      }}
    >
      <AuthForm type="signup" isModal={true} />
    </Dialog>
  );
}