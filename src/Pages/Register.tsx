import { Box, Button, Card, CardMedia, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { supabase } from '../DataBase/SupaBaseClient';

function Register() {

    const [userData, setData] = useState({ usuario: "", contrasena: "", contrasena2: "" });
    const [alert, setAlert] = useState({ message: "", severity: "" });
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (userData.contrasena === userData.contrasena2) {

            const { data } = await supabase
                .from('Usuarios')
                .select('*')
                .eq('usuario', userData.usuario);

            const exists = data && data.length > 0;

            if (!exists) {
                const { error } = await supabase
                    .from('Usuarios')
                    .insert([{ usuario: userData.usuario, password: userData.contrasena, rol: '1' }]);
                if (error) {
                    console.error('Error inserting user:', error);
                    setAlert({ message: "Error al registrar el usuario", severity: "error" });
                } else {
                    navigate('/');
                }
            } else {
                setAlert({ message: "Nombre de usuario ya en uso", severity: "error" });
            }
        } else {
            setAlert({ message: "Las contraseñas no coinciden", severity: "error" });
        }
    };

    const boxStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "500px",
        margin: "20px auto",
        flexDirection: "column",
        marginTop: 50,
        gap: 10,
    };

    return (
        <>
            <Box style={boxStyle} component="form" onSubmit={handleSubmit}>
                <Typography>REGISTRARSE</Typography>

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
                    value={userData.usuario}
                    onChange={(e) => setData({ ...userData, usuario: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <TextField
                    required
                    type="password"
                    fullWidth
                    id="Contrasena"
                    label="Contrasena"
                    value={userData.contrasena}
                    onChange={(e) => setData({ ...userData, contrasena: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <TextField
                    required
                    type="password"
                    fullWidth
                    id="Repetir Contrasena"
                    label="Repetir contrasena"
                    value={userData.contrasena2}
                    onChange={(e) => setData({ ...userData, contrasena2: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <Button variant="contained" fullWidth type='submit' color='error'>
                    Registarse
                </Button>
                <Button variant="contained" fullWidth onClick={handleLogin} color='error'>
                    Inicar Sesión
                </Button>

                {alert.message && (
                    <Alert
                        severity={(alert.severity = "error")}
                        style={{ marginTop: "10px", width: "100%" }}
                    >
                        {alert.message}
                    </Alert>
                )}
            </Box>
        </>
    );
}

export default Register;
