import {
    Avatar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import {Menu} from "@mui/icons-material";

export function RootPage() {

    const theme = useTheme()

    return (
        <Box sx={{display: "flex"}}>
            <CssBaseline/>
            <Drawer variant="permanent" sx={{
                [theme.breakpoints.up("sm")]: {
                    width: `calc(${theme.spacing(16)} + 1px)`,
                },
                "& .MuiDrawer-paper": {
                    [theme.breakpoints.up("sm")]: {
                        width: `calc(${theme.spacing(16)} + 1px)`,
                    },
                },
            }}>
                <Toolbar sx={{justifyContent: "center"}}>
                    <IconButton color="inherit">
                        <Menu fontSize="large"/>
                    </IconButton>
                </Toolbar>
                <Divider/>
                <List>
                    {["John", "Clark", "Smite"].map(value =>
                        <ListItem disablePadding>
                            <ListItemButton sx={{flexDirection: "column", justifyContent: "center", flexWrap: "wrap"}}>
                                <Avatar sx={{justifyContent: "center"}}>{value[0]}</Avatar>
                                <ListItemText sx={{textAlign: "center"}}>{value}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Typography sx={{marginBottom: 2}}>I'm trash :D</Typography>
                <img alt="trash"
                     src="http://www.quickmeme.com/img/c4/c4117905ec08b0df9aaf8c4a19433f31e1b62ea8f6d1680ccd2c3449ac9141bf.jpg"/>
            </Box>
        </Box>
    )
}