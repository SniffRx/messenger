import { Box, Typography } from "@mui/material";

export function ErrorPage() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Typography variant="h3" color="error">
                404 - Page Not Found
            </Typography>
            <Typography variant="body1">The page you are looking for does not exist.</Typography>
        </Box>
    );
}
