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
import { useSelector } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePresentIcon from '@mui/icons-material/FilePresent';



function Menu() {
    const [open, setOpen] = React.useState(false);
    const userData = useSelector((state: RootState) => state.authenticator)
    const isLoggedin = userData.isAutenticated

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {isLoggedin ? (
                    <ListItem disablePadding>
                        <Link to='/Upload' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <CloudUploadIcon color='error'/>
                                </ListItemIcon>
                                <ListItemText primary="Subir archivo" sx={{ color: 'red' }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}
                {isLoggedin ? (
                    <ListItem disablePadding>
                        <Link to='/ShowPersonalSessions' style={{ textDecoration: 'none' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <FilePresentIcon color='error'/>
                                </ListItemIcon>
                                <ListItemText primary="Archivos Personales" sx={{ color: 'red' }}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}


                {/*
                {rol == 'admin' ? (
                    <ListItem disablePadding>
                        <Link to='/Reports' style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reports" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}
                {rol == 'admin' ? (
                    <ListItem disablePadding>
                        <Link to='/GestionUsuarios' style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Gestión usuarios" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}
                {rol != 'invitado' ? (
                    <ListItem disablePadding>
                        <Link to='/GestionPrestamos' style={{ textDecoration: 'none', color: 'inherit' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Gestión Prestamos" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ) : null}
                <ListItem disablePadding>
                    <Link to={'/Manual_de_usuario_DAD.pdf'} style={{ textDecoration: 'none', color: 'inherit' }} target='_blank'>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Ayuda" />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Salir" />
                        </ListItemButton>
                    </Link>
                </ListItem>
                */}
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
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </Box>
    );
}

export default Menu;