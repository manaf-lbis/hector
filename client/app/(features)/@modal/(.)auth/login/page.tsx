import { Dialog } from "@mui/material"
import { AuthForm } from "@/components/auth/AuthForm"

const page = () => {
  return (
    <Dialog open={true}>
      <AuthForm type="login" />
    </Dialog>
  )
}

export default page