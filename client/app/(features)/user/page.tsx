"use client"

import { Box, Typography, Container, Grid } from "@mui/material";
import WeatherCard from "@/components/features/dashboard/WeatherCard";
import FarmerSupportCard from "@/components/features/dashboard/FarmerSupportCard";
import CategoryPills from "@/components/features/dashboard/CategoryPills";
import QuickAccess from "@/components/features/dashboard/QuickAccess";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetCategoriesQuery } from "@/store/api/category.api";
import { DASHBOARD_STRINGS } from "@/constants/dashboard.constants";

export default function UserDashboard() {
    const { user } = useSelector((state: RootState) => state.user);
    const { data: categories = [] } = useGetCategoriesQuery();

    return (
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4, minHeight: '80vh' }}>
            <Box sx={{ mb: 6, textAlign: 'left' }}>
                <Typography variant="h3" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                    Hello, {user?.name.split(' ')[0]} 
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500} sx={{ opacity: 0.6, maxWidth: 600 }}>
                    {DASHBOARD_STRINGS.SUBTITLE}
                </Typography>
            </Box>

            <Grid container spacing={3} alignItems="stretch" sx={{ mb: 10 }}>
                <Grid size={{ xs: 12, sm: 5 }}>
                    <WeatherCard location={user?.location as any} />
                </Grid>
                <Grid size={{ xs: 12, sm: 7 }}>
                    <FarmerSupportCard />
                </Grid>
            </Grid>

            {categories.length > 0 && <CategoryPills categories={categories} />}
            
            <QuickAccess />
            
        </Container>
    );
}
