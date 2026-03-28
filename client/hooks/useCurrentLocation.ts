import { useState, useCallback, useEffect } from 'react';
import { useUpdateUserLocationMutation } from '@/store/api/auth.api';

export const DEFAULT_LOCATION = {
    lat: 8.8932,
    lng: 76.6141,
    city: 'Kollam',
    state: 'Kerala',
    address: 'Kollam, Kerala, India'
};

export const useCurrentLocation = (user: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updateLocation] = useUpdateUserLocationMutation();

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const fetchGeocode = async (lat: number, lng: number, apiKey: string) => {
        try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
            const data = await res.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const result = data.results[0];
                let city = '';
                let state = '';

                result.address_components.forEach((component: any) => {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (component.types.includes('administrative_area_level_1')) {
                        state = component.long_name;
                    }
                });

                if (!city) {
                    const district = result.address_components.find((c: any) => c.types.includes('administrative_area_level_2'));
                    if (district) city = district.long_name;
                }

                return {
                    address: result.formatted_address,
                    city: city || 'Unknown City',
                    state: state || 'Unknown State'
                };
            }
        } catch (err) {
            console.error('Geocoding error:', err);
        }
        return null;
    };

    const synchronizeLocation = useCallback(async () => {
        const hasValidLocation = !!(user?.location?.coordinates && 
                                 Number.isFinite(user.location.coordinates[1]) && 
                                 Number.isFinite(user.location.coordinates[0]));

        if (!user || hasValidLocation || !apiKey) return;

        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            await applyDefaultLocation();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                const geocodeData = await fetchGeocode(latitude, longitude, apiKey);

                if (geocodeData) {
                    await updateLocation({
                        lat: latitude,
                        lng: longitude,
                        ...geocodeData
                    }).unwrap();
                } else {
                    await applyDefaultLocation();
                }
                setIsLoading(false);
            },
            async (geolocationError) => {
                console.warn('Geolocation denied or failed. Applying default location.', geolocationError);
                await applyDefaultLocation();
            },
            { timeout: 10000 }
        );
    }, [user, apiKey, updateLocation]);

    const applyDefaultLocation = async () => {
        try {
            await updateLocation(DEFAULT_LOCATION).unwrap();
        } catch (err) {
            console.error('Failed to set default location', err);
            setError('Failed to configure default location');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        synchronizeLocation();
    }, [synchronizeLocation]);

    return { isLoading, error, synchronizeLocation };
};
