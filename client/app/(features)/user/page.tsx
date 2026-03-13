import { Box, Typography, Container, Grid, Paper, Card, CardContent, Divider } from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AgricultureIcon from '@mui/icons-material/Agriculture';

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

            <Grid container spacing={3}>
                {/* Summary Widgets */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={2} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main' }}>
                                <AssessmentIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={700}>12</Typography>
                                <Typography variant="body2" color="text.secondary">Active Bids</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={2} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'success.light', color: 'success.main' }}>
                                <AgricultureIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={700}>8</Typography>
                                <Typography variant="body2" color="text.secondary">Listed Crops</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card elevation={2} sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.main' }}>
                                <AccountBalanceWalletIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight={700}>₹ 45k</Typography>
                                <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Main Content Area */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Recent Market Activity
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                                No recent market activity found. Start listing your crops to see insights here!
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Side Panel Area */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', bgcolor: 'background.default' }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            System Alerts
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'warning.main' + '20', border: '1px solid', borderColor: 'warning.light' }}>
                            <Typography variant="subtitle2" color="warning.dark" fontWeight={600}>Action Required</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Please complete your KYC verification to unlock full bidding features.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
