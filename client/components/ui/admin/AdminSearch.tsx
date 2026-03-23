import React from 'react';
import { Box, TextField, InputAdornment, alpha } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface AdminSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const AdminSearch: React.FC<AdminSearchProps> = ({ value, onChange, placeholder = "Search..." }) => {
    return (
        <TextField
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            variant="outlined"
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                ),
                sx: {
                    borderRadius: '12px',
                    bgcolor: 'background.paper',
                    '& fieldset': {
                        borderColor: alpha('#000', 0.1),
                    },
                    '&:hover fieldset': {
                        borderColor: alpha('#000', 0.2),
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 1.5
                    }
                }
            }}
            sx={{ maxWidth: 400 }}
        />
    );
};

export default AdminSearch;
