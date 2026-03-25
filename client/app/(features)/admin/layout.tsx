import AdminNavbar from "@/components/layout/AdminNavbar";
import { Box } from "@mui/material";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AdminNavbar />
            <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
                {children}
            </Box>
        </Box>
    );
}
