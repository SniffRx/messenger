import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            // Simulate login request
            const response = await fakeLogin(email, password);
            console.log('Login successful:', response);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }
    };

    const fakeLogin = (email: string, password: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'user@example.com' && password === 'password123') {
                    resolve('Login successful!');
                } else {
                    reject(new Error('Invalid email or password.'));
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
                Login
            </Typography>
            <Box
                component="form"
                onSubmit={handleLogin}
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
                {error && <Alert severity="error">{error}</Alert>}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </Box>
        </Box>
    );
}
