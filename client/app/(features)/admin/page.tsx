import { Box, Typography, Container, Paper } from "@mui/material";

export default function AdminDashboard() {
    return (
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom color="error">
                    Admin Dashboard
                </Typography>
                <Typography variant="body1">
                    Welcome to the administrator control panel. You have access to system-wide settings and user management.
                </Typography>
                <Box sx={{ mt: 4, p: 2, bgcolor: 'error.light', borderRadius: 1, color: 'error.contrastText' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        System Status
                    </Typography>
                    <Typography variant="body2">
                        All systems are running normally.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}
