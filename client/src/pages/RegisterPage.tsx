import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Simulate registration request
            const response = await fakeRegister(email, password);
            setSuccess(response);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }
    };

    const fakeRegister = (email: string, password: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email !== 'existing@example.com') {
                    resolve('Registration successful!');
                } else {
                    reject(new Error('Email already in use.'));
                }
            }, 1000);
        });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            padding={2}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleRegister}
                display="flex"
                flexDirection="column"
                gap={2}
                width="100%"
                maxWidth="400px"
            >
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    required
                />
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </Box>
        </Box>
    );
}
