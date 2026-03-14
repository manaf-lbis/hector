import { Box, Typography, Container, Grid, Paper, Card, CardContent, Divider } from "@mui/material";


export default function UserDashboard() {
    return (
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4, minHeight: '80vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" gutterBottom>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back! Here is a summary of your recent crop trading activities.
                </Typography>
            </Box>





        </Container>
    );
}
