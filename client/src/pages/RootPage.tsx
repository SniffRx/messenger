import {
    Autocomplete,
    Avatar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import { Folder, Menu } from "@mui/icons-material";
import { MouseEventHandler, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function RootPage() {
    const [dummyList, setDummyList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Место для ваших чатов и папок
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [chatListWidth, setChatListWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [startMouseX, setStartMouseX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    useEffect(() => {
        // Проверка авторизации. Если не авторизован, редирект на страницу входа
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
        } else {
            // Здесь можно добавить дополнительные проверки или запросы к серверу, чтобы убедиться в действительности токена.
        }
    }, [navigate]);

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setIsResizing(true);
        setStartMouseX(e.clientX);
        setStartWidth(chatListWidth);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const delta = e.clientX - startMouseX;
        const newWidth = Math.min(Math.max(startWidth + delta, 200), 400);
        setChatListWidth(newWidth);
    };

    const handleMouseUp = () => {
        if (isResizing) {
            setIsResizing(false);

            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    [theme.breakpoints.up("sm")]: {
                        width: `calc(${theme.spacing(12)} + 1px)`,
                    },
                    "& .MuiDrawer-paper": {
                        [theme.breakpoints.up("sm")]: {
                            width: `calc(${theme.spacing(12)} + 1px)`,
                        },
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: "center" }}>
                    <IconButton color="inherit">
                        <Menu fontSize="large" />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ height: "1px" }} />
                <List>
                    {dummyList.map((value) => (
                        <ListItem disablePadding key={value}>
                            <ListItemButton
                                sx={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                }}
                            >
                                <ListItemIcon sx={{ justifyContent: "center" }}>
                                    <Folder fontSize="large" />
                                </ListItemIcon>
                                <ListItemText sx={{ textAlign: "center" }}>
                                    Folder {value}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                sx={{
                    width: chatListWidth,
                    minWidth: "200px",
                    maxWidth: "400px",
                    bgcolor: theme.palette.background.paper,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    overflowY: "auto",
                    position: "relative",
                }}
            >
                <Toolbar>
                    <Autocomplete
                        fullWidth
                        freeSolo
                        options={dummyList.map((option) => option)}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Search" size="small" />
                        )}
                    />
                </Toolbar>
                <Divider sx={{ height: "1px", backgroundColor: theme.palette.divider, position: "relative" }} />
                <List>
                    {dummyList.map((value, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => navigate(`chat/${value}`)}>
                                <Avatar sx={{ marginRight: 2 }}>C</Avatar>
                                <ListItemText
                                    primaryTypographyProps={{
                                        sx: {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        },
                                    }}
                                    secondaryTypographyProps={{
                                        sx: {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        },
                                    }}
                                    primary={`Chat ${value}`}
                                    secondary="Last message..."
                                />
                                <Typography variant="body1" alignSelf="baseline">
                                    10:00PM
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box
                    onMouseDown={handleMouseDown}
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "5px",
                        height: "100%",
                        cursor: "ew-resize",
                        zIndex: 1,
                        bgcolor: "transparent",
                    }}
                />
            </Box>

            <Box
                bgcolor={theme.palette.primary.main}
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    overflowY: "auto",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
