import UserNavbar from "@/components/layout/UserNavbar";
import { Box } from "@mui/material";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <UserNavbar />
            <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
                {children}
            </Box>
        </Box>
    );
}
