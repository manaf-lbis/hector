import { Dialog } from "@mui/material"
import { AuthForm } from "@/components/auth/AuthForm"

const page = () => {
  return (
    <Dialog open={true}>
      <AuthForm  type="signup" />
    </Dialog>
  )
}

export default page