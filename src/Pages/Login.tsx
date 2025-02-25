import { Box, Button, Card, CardMedia, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux'
import { authActions } from '../store/authSlice';
import { supabase } from "../DataBase/SupaBaseClient";


function Login() {

    const dispatch = useDispatch()

    const [userData, setData] = useState({ usuario: '', contrasena: '' })
    const [alert, setAlert] = useState({ message: '', severity: '' })
    const navigate = useNavigate()

    const handleRegister = () => {
        navigate('/Register')
    }

    const handleNoLogin = () => {
        dispatch(authActions.login({
            name: "guest",
            rol: "0"
        }))
        navigate('/ShowPersonalSessions')
    }

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const { data } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('usuario', userData.usuario).eq('password', userData.contrasena);
        const exists = data && data.length > 0;
        if (exists) {
            let avatarBase64 = null;
            if (data[0].avatar) {
                const byteArray = new Uint8Array(data[0].avatar);
                avatarBase64 = btoa(String.fromCharCode(...byteArray));
                avatarBase64 = `data:image/jpeg;base64,${avatarBase64}`;
            }
            dispatch(authActions.login({
                name: data[0].usuario,
                rol: data[0].rol,
                ...(avatarBase64 && { avatar: avatarBase64 })
            }));
            navigate('/Upload')
        } else {
            setAlert({ message: "Usuario o contraseña incorrectos", severity: "error" });
        }
    };

    const boxStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '500px',
        margin: '20px auto',
        flexDirection: 'column',
        marginTop: 50,
        gap: 10,
    };

    return (
        <>
            <Box style={boxStyle}
                component='form'
                onSubmit={handleSubmit}
            >
                <Typography>
                    INICIAR SESIÓN
                </Typography>

                <Card>
                    <CardMedia
                        component="img"
                        height="140"
                        image="/common/logo.png"
                        alt="Assetto logo"
                    />
                </Card>

                <TextField
                    required
                    fullWidth
                    id="Usuario"
                    label="Usuario"
                    value={userData.usuario} onChange={(e) => setData({ ...userData, usuario: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <TextField
                    required
                    type='password'
                    fullWidth
                    id="Contrasena"
                    label="Contrasena"
                    value={userData.contrasena} onChange={(e) => setData({ ...userData, contrasena: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <Button variant='contained' fullWidth type='submit' color='error'>Acceder</Button>
                <Button variant='contained' fullWidth onClick={handleRegister} color='error'>Registrarse</Button>
                <Button variant='contained' fullWidth onClick={handleNoLogin} color='error'>Acceder sin identificarse</Button>

                {alert.message && (
                    <Alert severity={alert.severity = 'error'} style={{ marginTop: '10px', width: '100%' }}>
                        {alert.message}
                    </Alert>
                )}

            </Box>
        </>
    )
}

export default Login;