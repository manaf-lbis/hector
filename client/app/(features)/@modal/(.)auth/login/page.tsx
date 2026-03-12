import { Dialog } from "@mui/material";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <Dialog open={true}>
      <AuthForm type="login" />
    </Dialog>
  );
}