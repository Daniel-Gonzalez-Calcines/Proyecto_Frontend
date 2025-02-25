import { Box, Button, TextField, Typography } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
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
        navigate('Register')
    }

    const handleNoLogin = () => {
        dispatch(authActions.login({
            name: "guest",
            rol: "0"
        }))
        navigate('Upload')
    }

    const handleSubmit = async () => {
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
        marginTop: 200,
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

                <LockIcon />

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

                <Button variant='contained' fullWidth type='submit'>Acceder</Button>
                <Button variant='contained' fullWidth onClick={handleRegister}>Registrarse</Button>
                <Button variant='contained' fullWidth onClick={handleNoLogin}>Acceder sin identificarse</Button>

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