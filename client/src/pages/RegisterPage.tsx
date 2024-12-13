import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('/'); // Если токен есть, редирект на главную страницу
        }
    }, [navigate]);

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
            const response = await fakeRegister(email, password);
            setSuccess(response);
            setTimeout(() => navigate('/login'), 2000); // Редирект через 2 секунды
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
                <Button
                    variant="text"
                    color="secondary"
                    fullWidth
                    onClick={() => navigate('/login')}
                >
                    Back to Login
                </Button>
            </Box>
        </Box>
    );
}
