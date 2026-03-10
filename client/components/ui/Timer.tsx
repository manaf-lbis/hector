'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, CircularProgress } from '@mui/material';

interface TimerProps {
    seconds: number;
    onResend?: () => void;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean; 
}

const Timer = ({ seconds, onResend, size = 'medium', loading }: TimerProps) => {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (timeLeft <= 0) {
            setIsActive(false);
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const variant = size === 'small' ? 'caption' : size === 'large' ? 'h5' : 'body1';

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Typography variant={variant} color={isActive ? 'text.secondary' : 'primary'}>
                {isActive ? `Resend in ${timeLeft}s` : "Didn't receive code?"}
            </Typography>

            {!isActive && onResend && (
                <Button
                    size={size === 'small' ? 'small' : 'medium'}
                    variant="text"
                    disabled={loading} 
                    sx={{ p: 0, minWidth: 'auto', fontWeight: 700 }}
                    onClick={() => {
                        onResend();
                        setTimeLeft(seconds);
                        setIsActive(true);
                    }}
                >
                    {loading ? <CircularProgress size={16} sx={{ ml: 1 }} /> : 'Resend'}
                </Button>
            )}
        </Box>
    );
};

export default Timer;