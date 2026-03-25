import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';

interface MapSelectionProps {
    center: { lat: number; lng: number };
    zoom?: number;
    onMapClick?: (e: google.maps.MapMouseEvent) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '250px',
    borderRadius: '12px'
};

const MapSelection: React.FC<MapSelectionProps> = ({ center, zoom = 14, onMapClick }) => {
    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(function callback() {
        mapRef.current = null;
    }, []);

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onMapClick}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: true,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                }}
            >
                {/* Marker is strictly fixed to the prop center */}
                <Marker position={center} />
            </GoogleMap>
        </Box>
    );
};

export default React.memo(MapSelection);
