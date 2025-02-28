import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Card, CardMedia, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { RootState } from "../store";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { authActions } from '../store/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';


function Menu() {
    const [open, setOpen] = React.useState(false);
    const userData = useSelector((state: RootState) => state.authenticator)
    const rol = userData.userRol
    const dispatch = useDispatch()

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const handleLogout = () => {
        dispatch(authActions.logout());
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {parseInt(rol) > 0 ? (
                    <ListItem disablePadding>
                        <Link to='/Upload' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <CloudUploadIcon sx={{color: 'white'}} />
                                </ListItemIcon>
                                <ListItemText primary="Subir archivo" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}
                <ListItem disablePadding>
                    <Link to='/ShowPersonalSessions' style={{ textDecoration: 'none' }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <FilePresentIcon sx={{color: 'white'}} />
                            </ListItemIcon>
                            <ListItemText primary="Archivos Personales" sx={{color: 'white'}} />
                        </ListItemButton>
                    </Link>
                </ListItem>
                {parseInt(rol) > 0 ? (
                    <ListItem disablePadding>
                        <Link to='/Friends' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <CloudUploadIcon sx={{color: 'white'}} />
                                </ListItemIcon>
                                <ListItemText primary="Amigos" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}
                {parseInt(rol) > 0 ? (
                    <ListItem disablePadding>
                        <Link to='/' style={{ textDecoration: 'none' }} onClick={handleLogout}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LogoutIcon sx={{color: 'white'}} />
                                </ListItemIcon>
                                <ListItemText primary="Cerrar sesión" sx={{color: 'white'}} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) :
                    <ListItem disablePadding>
                        <Link to='/' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LoginIcon sx={{color: 'white'}} />
                                </ListItemIcon>
                                <ListItemText primary="Iniciar sesión" sx={{color: 'white'}} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                }
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" color="error">
                <Toolbar>
                    <Tooltip title="Menu" arrow placement="bottom">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {userData.userName}
                    </Typography>
                    {userData.userAvatar === '' ? (
                        <Typography>
                            Yet not implemented
                        </Typography>
                    ) : (
                        <Card>
                            <CardMedia
                                component="img"
                                height="30"
                                image="/common/perfil-vacio.png"
                                alt="Usuario sin foto de perfil"
                            />
                        </Card>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: 'darkred',
                    },
                }}
            >
                {DrawerList}
            </Drawer>
        </Box>
    );
}

export default Menu;