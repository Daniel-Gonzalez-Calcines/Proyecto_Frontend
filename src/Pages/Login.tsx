import { Box, Button, TextField, Typography } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import { useDispatch } from 'react-redux'
import { authActions } from '../store/authSlice';


function Login() {

    const dispatch = useDispatch()

    const [data, setData] = useState({ usuario: '', contrasena: '' })
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

    const handleSubmit = (e: any) => {
        e.preventDefault()

        fetch(`http://localhost:5000/users?user=${data.usuario}&password=${data.contrasena}`)
            .then(response => response.json())
            .then(response => {
                console.log(response.data)
                if (response.data.length !== 0) {
                    dispatch(authActions.login({
                        name: response.data.nombre,
                        rol: response.data.rol
                    }))
                    navigate('/ShowPersonalSessions')
                } else {
                    setAlert({ message: 'Acceso denegado: Usuario o contraseñas incorrectos.', severity: 'error' });
                }
        })
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
                    value={data.usuario} onChange={(e) => setData({ ...data, usuario: e.target.value })}
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
                    value={data.contrasena} onChange={(e) => setData({ ...data, contrasena: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <Button variant='contained' fullWidth onClick={handleSubmit}>Acceder</Button>
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