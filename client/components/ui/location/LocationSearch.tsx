import React, { useState, useEffect, useRef } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { TextField, Autocomplete, CircularProgress, Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface LocationSearchProps {
    onSelect: (lat: number, lng: number, placeName: string) => void;
    placeholder?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect, placeholder = "Search for an area, street or landmark" }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here if needed, e.g. restrict to India */
            // componentRestrictions: { country: "in" },
        },
        debounce: 300,
    });

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();
        setOpen(false);
        setLoading(true);

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            onSelect(lat, lng, address);
        } catch (error) {
            console.error("Error fetching geocode:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Autocomplete
            open={open}
            onOpen={() => {
                if (value) setOpen(true);
            }}
            onClose={() => setOpen(false)}
            inputValue={value}
            onInputChange={(e, newInputValue) => {
                setValue(newInputValue);
                if (newInputValue) setOpen(true);
                else setOpen(false);
            }}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
            options={status === 'OK' ? data : []}
            filterOptions={(x) => x}
            autoComplete
            includeInputInList
            filterSelectedOptions
            onChange={(_event: any, newValue: any | null) => {
                if (newValue) {
                    handleSelect(typeof newValue === 'string' ? newValue : newValue.description);
                }
            }}
            noOptionsText={status === 'OK' && data.length === 0 ? "No results found" : "Type to search..."}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'action.hover',
                            borderRadius: '12px',
                            '& fieldset': { border: 'none' },
                            '&:hover fieldset': { border: 'none' },
                            '&.Mui-focused fieldset': { border: '1.5px solid', borderColor: 'primary.main' },
                            transition: 'all 0.2s ease',
                        },
                        '& .MuiInputBase-input': {
                            fontSize: '0.95rem',
                            fontWeight: 500,
                        }
                    }}
                />
            )}
            renderOption={(props, option) => {
                const { key, ...restProps } = props as any;
                return (
                <li key={key} {...restProps}>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', mr: 2 }} />
                        <Typography variant="body2" color="text.primary">
                            {option.structured_formatting?.main_text || option.description}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                {option.structured_formatting?.secondary_text}
                            </Typography>
                        </Typography>
                    </Box>
                </li>
            )}}
        />
    );
};

export default LocationSearch;
