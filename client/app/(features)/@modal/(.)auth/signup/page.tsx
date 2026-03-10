import { Dialog } from "@mui/material";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <Dialog open={true}>
      <AuthForm type="signup" />
    </Dialog>
  );
}