import { useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Stack,
    TextField,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import {
    Send,
    AttachFile,
    MoreVert,
    VideoCall,
    ScreenShare,
} from "@mui/icons-material";
import { Message } from "./components/Message.tsx";
import { ContentType } from "./components/types.ts";

export function ChatPage() {
    const [messages, setMessages] = useState(
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            time: "12:34",
            own: Math.random() < 0.5,
            type: (Math.random() < 0.8 ? "text" : "image") as ContentType,
        }))
    );

    const [isVideoCallOpen, setVideoCallOpen] = useState(false);
    const [isScreenShareOpen, setScreenShareOpen] = useState(false);

    const handleVideoCall = () => setVideoCallOpen(true);
    const handleScreenShare = () => setScreenShareOpen(true);
    const handleCloseVideoCall = () => setVideoCallOpen(false);
    const handleCloseScreenShare = () => setScreenShareOpen(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                bgcolor: "#f3f4f6",
                overflow: "hidden",
            }}
        >
            {/* Chat Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "white",
                    p: 2,
                    boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                        src="https://via.placeholder.com/40"
                        alt="User Avatar"
                        sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Chat Name
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Online
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={handleVideoCall}>
                        <VideoCall />
                    </IconButton>
                    <IconButton onClick={handleScreenShare}>
                        <ScreenShare />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </Stack>
            </Box>

            {/* Messages */}
            <Stack
                spacing={2}
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#cfd8dc",
                        borderRadius: "10px",
                    },
                }}
            >
                {messages.map((msg) => (
                    <Message key={msg.id} {...msg} />
                ))}
            </Stack>

            {/* Message Input */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "white",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <IconButton>
                    <AttachFile />
                </IconButton>
                <TextField
                    fullWidth
                    placeholder="Write a message..."
                    variant="outlined"
                    size="small"
                    sx={{
                        borderRadius: "20px",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                            backgroundColor: "#f9f9f9",
                        },
                    }}
                />
                <IconButton color="primary">
                    <Send />
                </IconButton>
            </Box>

            {/* Video Call Dialog */}
            <Dialog
                open={isVideoCallOpen}
                onClose={handleCloseVideoCall}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Video Call in Progress
                    </Typography>
                    <Box
                        sx={{
                            width: "100%",
                            height: "400px",
                            bgcolor: "#000",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography color="white">Video Stream</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVideoCall} color="secondary">
                        End Call
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Screen Share Dialog */}
            <Dialog
                open={isScreenShareOpen}
                onClose={handleCloseScreenShare}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Screen Sharing in Progress
                    </Typography>
                    <Box
                        sx={{
                            width: "100%",
                            height: "400px",
                            bgcolor: "#000",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography color="white">Screen Share Stream</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseScreenShare} color="secondary">
                        Stop Sharing
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
