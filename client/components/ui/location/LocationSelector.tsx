import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Drawer, useMediaQuery, useTheme, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AppButton from '../AppButton';
import { useJsApiLoader } from '@react-google-maps/api';
import LocationSearch from './LocationSearch';
import MapSelection from './MapSelection';
import { useUpdateUserLocationMutation } from '@/store/api/auth.api';
import { ILocation } from '@/types/user.type';

interface LocationSelectorProps {
    open: boolean;
    onClose: () => void;
    currentLocation?: ILocation;
}

const libraries: "places"[] = ["places"];

const LocationSelector: React.FC<LocationSelectorProps> = ({ open, onClose, currentLocation }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const [updateLocation, { isLoading: isUpdating }] = useUpdateUserLocationMutation();

    const defaultLat = 8.8932;
    const defaultLng = 76.6141;

    const [selectedPos, setSelectedPos] = useState({
        lat: Number.isFinite(currentLocation?.coordinates?.[1]) ? currentLocation!.coordinates[1] : defaultLat,
        lng: Number.isFinite(currentLocation?.coordinates?.[0]) ? currentLocation!.coordinates[0] : defaultLng
    });
    const [selectedAddress, setSelectedAddress] = useState(currentLocation?.address || '');
    const [selectedCity, setSelectedCity] = useState(currentLocation?.city || '');
    const [selectedState, setSelectedState] = useState(currentLocation?.state || '');

    useEffect(() => {
        if (open) {
            const hasValidCoords = Number.isFinite(currentLocation?.coordinates?.[1]) &&
                Number.isFinite(currentLocation?.coordinates?.[0]);

            const lat = hasValidCoords ? currentLocation!.coordinates[1] : defaultLat;
            const lng = hasValidCoords ? currentLocation!.coordinates[0] : defaultLng;

            setSelectedPos({ lat, lng });

            if (currentLocation?.address) {
                setSelectedAddress(currentLocation.address);
                setSelectedCity(currentLocation.city || '');
                setSelectedState(currentLocation.state || '');
            } else {
                reverseGeocode(lat, lng);
            }
        }
    }, [open, currentLocation]);

    const reverseGeocode = (lat: number, lng: number) => {
        if (!window.google) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const result = results[0];
                let city = '';
                let state = '';

                result.address_components.forEach((component) => {
                    if (component.types.includes('locality')) city = component.long_name;
                    if (component.types.includes('administrative_area_level_1')) state = component.long_name;
                });
                if (!city) {
                    const district = result.address_components.find(c => c.types.includes('administrative_area_level_2'));
                    if (district) city = district.long_name;
                }

                setSelectedAddress(result.formatted_address);
                setSelectedCity(city || 'Unknown City');
                setSelectedState(state || 'Unknown State');
            }
        });
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setSelectedPos({ lat, lng });
            reverseGeocode(lat, lng);
        }
    };

    const handleSearchSelect = (lat: number, lng: number, addressText: string) => {
        setSelectedPos({ lat, lng });
        setSelectedAddress(addressText);
        // After search selection, do a strict reverse geocode to grab exact city/state 
        reverseGeocode(lat, lng);
    };

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setSelectedPos({ lat, lng });
                reverseGeocode(lat, lng);
            });
        }
    };

    const handleConfirm = async () => {
        try {
            await updateLocation({
                lat: selectedPos.lat,
                lng: selectedPos.lng,
                address: selectedAddress,
                city: selectedCity,
                state: selectedState
            }).unwrap();
            onClose();
        } catch (err) {
            console.error("Failed to update location:", err);
        }
    };

    const content = (
        <Box sx={{ p: { xs: 2.5, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {isMobile && (
                <Box
                    sx={{
                        width: 40,
                        height: 4,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        alignSelf: 'center',
                        mb: 2,
                        mt: -1
                    }}
                />
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="800">Choose Location</Typography>
                <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'action.hover' }}><CloseIcon fontSize="small" /></IconButton>
            </Box>

            {loadError && <Typography color="error">Error loading maps</Typography>}

            {!isLoaded ? (
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ mb: 2 }}>
                        <LocationSearch onSelect={handleSearchSelect} />
                    </Box>

                    <AppButton
                        variant="text"
                        startIcon={<MyLocationIcon />}
                        onClick={handleLocateMe}
                        sx={{ mb: 2, justifyContent: 'flex-start' }}
                    >
                        Use Current Location
                    </AppButton>

                    <Box sx={{ flex: 1, minHeight: 300, borderRadius: 2, overflow: 'hidden', mb: 2 }}>
                        <MapSelection center={selectedPos} onMapClick={handleMapClick} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 'auto', pt: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Selected Location
                        </Typography>
                        <Typography variant="body2" fontWeight="600" color="text.primary" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3,
                            mb: 1
                        }}>
                            {selectedAddress || 'Drop a pin on the map'}
                        </Typography>

                        <AppButton
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleConfirm}
                            disabled={isUpdating || !selectedAddress}
                            loading={isUpdating}
                            sx={{ mt: 1 }}
                        >
                            Confirm Location
                        </AppButton>
                    </Box>
                </>
            )}
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer anchor="bottom" open={open} onClose={onClose} PaperProps={{ sx: { height: '70vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
                {content}
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, height: '700px' } }}>
            {content}
        </Dialog>
    );
};

export default LocationSelector;
