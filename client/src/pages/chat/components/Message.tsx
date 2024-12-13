import {Avatar, Box, Typography} from "@mui/material";
import {ChatMessage} from "./types.ts";

export function Message(props: ChatMessage) {

    const {text, time, own, type} = props

    return <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: own ? "flex-end" : "flex-start",
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-end",
                maxWidth: "70%",
                ...(own
                    ? {flexDirection: "row-reverse"}
                    : {flexDirection: "row"}),
            }}
        >
            {!own && (
                <Avatar
                    src="https://via.placeholder.com/40"
                    alt="Avatar"
                    sx={{width: 32, height: 32, mr: 1}}
                />
            )}
            <Box
                sx={{
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: own ? "#1976d2" : "white",
                    color: own ? "white" : "black",
                    boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                    ...(type === "image" && {
                        p: 0,
                        bgcolor: "transparent",
                        boxShadow: "none",
                    }),
                }}
            >
                {type === "text" ? (
                    <Typography variant="body1">{text}</Typography>
                ) : (
                    <Box
                        component="img"
                        src="https://via.placeholder.com/150"
                        alt="Random"
                        sx={{borderRadius: "12px", width: "100%", height: "auto"}}
                    />
                )}
            </Box>
        </Box>
        <Typography
            variant="caption"
            color="textSecondary"
            sx={{mt: 0.5, alignSelf: own ? "flex-end" : "flex-start"}}
        >
            {time}
        </Typography>
    </Box>
}