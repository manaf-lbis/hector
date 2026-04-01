"use client";

import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton, Grid, alpha, CircularProgress } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import { useGetWeatherQuery } from '@/store/api/weather.api';

interface WeatherCardProps {
    location?: { coordinates: [number, number], city?: string, state?: string };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ location }) => {
    const lon = location?.coordinates?.[0] || 80.9462;
    const lat = location?.coordinates?.[1] || 26.8467;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const { data: weather, isLoading } = useGetWeatherQuery(
        { lat, lon, key: apiKey },
        { skip: !apiKey }
    );

    if (isLoading) return <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px' }} />;

    const temp = weather?.temp || 21;

    const displayLocation = location?.city 
        ? `${location.city}${location.state ? `, ${location.state}` : ''}`
        : (weather?.location || 'Location Unknown');

    return (
        <Card className="glass-emerald" elevation={0} sx={{ 
            height: { xs: 'auto', sm: '100%' }, 
            minHeight: { xs: 220, sm: 200 },
            width: '100%',
            color: 'primary.main',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            border: 'none',
        }}>
            <CardContent sx={{ 
                position: 'relative', 
                zIndex: 1, 
                p: { xs: 2.5, md: 4 },
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Left Side: Temp & Icon */}
                    <Grid size={{ xs: 12, lg: 5 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                            <FilterDramaIcon sx={{ fontSize: 32, color: 'primary.main', opacity: 0.8 }} />
                            <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ opacity: 0.6 }}>
                                {weather?.condition || 'Sunny'}
                            </Typography>
                        </Box>
                        <Typography variant="h2" fontWeight={900} color="primary.main" sx={{ letterSpacing: '-0.02em', fontSize: { xs: '3rem', md: '3.5rem' } }}>
                            {temp}°
                        </Typography>
                    </Grid>

                    {/* Divider */}
                    <Box sx={{ width: '1px', height: '60px', bgcolor: 'primary.main', opacity: 0.1, mx: 2, display: { xs: 'none', lg: 'block' } }} />

                    {/* Right Side: Details */}
                    <Grid size={{ xs: 12, lg: 7 }} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={900} color="primary.main" sx={{ mb: 1.5, opacity: 0.9 }}>
                            {displayLocation}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CircularProgress 
                                        variant="determinate" 
                                        value={weather?.humidity || 28} 
                                        size={32} 
                                        thickness={5}
                                        sx={{ color: 'primary.main', opacity: 0.1 }}
                                    />
                                    <CircularProgress 
                                        variant="determinate" 
                                        value={weather?.humidity || 28} 
                                        size={32} 
                                        thickness={5}
                                        sx={{ color: 'primary.main', position: 'absolute' }}
                                    />
                                    <WaterDropIcon sx={{ fontSize: 14, position: 'absolute', color: 'primary.main' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" fontWeight={900} display="block" color="primary.main">{weather?.humidity || 28}%</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, color: 'primary.main' }}>Humidity</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ 
                                    p: 0.8, 
                                    bgcolor: alpha('#1B8A5A', 0.1), 
                                    borderRadius: '50%',
                                    display: 'flex'
                                }}>
                                    <AirIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" fontWeight={900} display="block" color="primary.main">{weather?.windSpeed || 18.12}</Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700, color: 'primary.main' }}>Windspeed</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default WeatherCard;
