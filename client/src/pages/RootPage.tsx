import {
    Autocomplete,
    Avatar,
    Box,
    Button,
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import { Folder, Menu, PersonAdd, Cancel } from "@mui/icons-material";
import { MouseEventHandler, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getChats, getUserFriends, addUserFriend, removeUserFriend, acceptUserFriendRequest, createChat } from "../api/apiClient"; // Импортируем необходимые функции

export function RootPage() {
    const [chatList, setChatList] = useState<any[]>([]); // Список чатов
    const [friends, setFriends] = useState<any[]>([]); // Список друзей
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]); // Заявки на дружбу
    const [friendUsername, setFriendUsername] = useState<string>(""); // Для добавления друга
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false); // Для индикации загрузки
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [chatListWidth, setChatListWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);
    const [startMouseX, setStartMouseX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    useEffect(() => {
        async function fetchChats() {
            try {
                const chats = await getChats();
                setChatList(chats);
            } catch (err) {
                console.error("Failed to load chats");
            }
        }

        async function fetchFriends() {
            setLoading(true);
            try {
                const userFriends = await getUserFriends();
                setFriends(userFriends.filter(friend => friend.status === "accepted"));
                setIncomingRequests(userFriends.filter(friend => friend.status === "pending"));
            } catch (err) {
                console.error("Failed to load friends");
            } finally {
                setLoading(false);
            }
        }

        fetchChats();
        fetchFriends();
    }, []);

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

    // Функция для добавления друга
    const handleAddFriend = async () => {
        try {
            await addUserFriend(friendUsername);
            setFriendUsername("");
            alert(`Friend request sent to ${friendUsername}`);
        } catch (err) {
            alert("Failed to send friend request.");
        }
    };

    // Функция для удаления друга
    const handleRemoveFriend = async (friendId: string) => {
        try {
            await removeUserFriend(friendId);
            setFriends((prev) => prev.filter(friend => friend.id !== friendId));
            alert(`You removed ${friendId} from your friends.`);
        } catch (err) {
            alert("Failed to remove friend.");
        }
    };

    // Функция для принятия заявки в друзья
    const handleAcceptFriend = async (friendId: string) => {
        try {
            await acceptUserFriendRequest(friendId);
            setIncomingRequests((prev) => prev.filter(friend => friend.id !== friendId));
            alert(`You are now friends with ${friendId}`);
        } catch (err) {
            alert("Failed to accept friend request.");
        }
    };

    // Функция для создания нового чата
    const handleCreateChat = async (friendId: string) => {
        try {
            const newChat = await createChat(friendId);
            setChatList((prev) => [...prev, newChat]);
            navigate(`/chat/${newChat.id}`);
        } catch (err) {
            alert("Failed to create chat.");
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSearchFriend = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFriendUsername(event.target.value);
    };

    useEffect(() => {
        // Проверка авторизации. Если не авторизован, редирект на страницу входа
        const token = localStorage.getItem("authToken");
        if (!token && location.pathname !== "/login" && location.pathname !== "/register") {
            navigate("/login");
        }
    }, [navigate, location]);

    // Скрываем `RootPage` для страниц /login и /register
    if (location.pathname === "/login" || location.pathname === "/register") {
        return <Outlet />;
    }

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
                    {chatList.map((chat) => (
                        <ListItem key={chat.id} disablePadding>
                            <ListItemButton onClick={() => navigate(`/chat/${chat.id}`)}>
                                <ListItemIcon sx={{ justifyContent: "center" }}>
                                    <Folder fontSize="large" />
                                </ListItemIcon>
                                <ListItemText sx={{ textAlign: "center" }}>
                                    {chat.name}
                                </ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box sx={{ width: chatListWidth, minWidth: "200px", maxWidth: "400px", bgcolor: theme.palette.background.paper, borderRight: `1px solid ${theme.palette.divider}`, overflowY: "auto", position: "relative" }}>
                <Toolbar>
                    <Autocomplete fullWidth freeSolo options={chatList.map((chat) => chat.name)} renderInput={(params) => <TextField {...params} variant="outlined" label="Search" size="small" />} />
                    <Button sx={{ marginLeft: 2 }} onClick={handleOpenDialog}>
                        Add Friend
                    </Button>
                </Toolbar>
                <Divider sx={{ height: "1px", backgroundColor: theme.palette.divider, position: "relative" }} />
                <List>
                    {friends.length === 0 ? (
                        <Typography sx={{ textAlign: "center", padding: 2 }}>No friends available</Typography>
                    ) : (
                        friends.map((friend) => (
                            <ListItem key={friend.id} disablePadding>
                                <ListItemButton>
                                    <Avatar sx={{ marginRight: 2 }}>{friend.name[0]}</Avatar>
                                    <ListItemText primary={friend.name} />
                                    <Button onClick={() => handleCreateChat(friend.id)}>Create Chat</Button>
                                    <Button onClick={() => handleRemoveFriend(friend.id)}>Remove</Button>
                                </ListItemButton>
                            </ListItem>
                        ))
                    )}
                    {incomingRequests.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Incoming Friend Requests:</Typography>
                            <List>
                                {incomingRequests.map((friend) => (
                                    <ListItem key={friend.id} disablePadding>
                                        <ListItemButton>
                                            <ListItemText primary={friend.name} />
                                            <Button onClick={() => handleAcceptFriend(friend.id)}>Accept</Button>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </List>
            </Box>

            <Box bgcolor={theme.palette.primary.main} component="main" padding={0} flexGrow={1} overflowY="auto">
                <Outlet />
            </Box>

            {/* Модальное окно для добавления друга */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Friend's Username"
                        fullWidth
                        value={friendUsername}
                        onChange={handleSearchFriend}
                        variant="outlined"
                        size="small"
                    />
                    <Box sx={{ mt: 2 }}>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Button fullWidth variant="contained" color="primary" onClick={handleAddFriend}>
                                    Add Friend
                                </Button>
                                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                                    {friendUsername ? `No user found with username: ${friendUsername}` : "Search and add a friend."}
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
