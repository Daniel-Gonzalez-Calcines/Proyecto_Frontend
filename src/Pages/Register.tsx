import { Box, Button, TextField, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

function Register() {

    const [data, setData] = useState({ usuario: "", contrasena: "", contrasena2: "" });
    const [alert, setAlert] = useState({ message: "", severity: "" });
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (data.contrasena === data.contrasena2) {
            fetch(
                `http://localhost:5000/register?user=${data.usuario}&password=${data.contrasena}`
            )
            navigate('/');
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
        marginTop: 200,
        gap: 10,
    };

    return (
        <>
            <Box style={boxStyle} component="form">
                <Typography>REGISTRARSE</Typography>

                <LockIcon />

                <TextField
                    required
                    fullWidth
                    id="Usuario"
                    label="Usuario"
                    value={data.usuario}
                    onChange={(e) => setData({ ...data, usuario: e.target.value })}
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
                    value={data.contrasena}
                    onChange={(e) => setData({ ...data, contrasena: e.target.value })}
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
                    value={data.contrasena2}
                    onChange={(e) => setData({ ...data, contrasena2: e.target.value })}
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <Button variant="contained" fullWidth onClick={handleSubmit}>
                    Registarse
                </Button>
                <Button variant="contained" fullWidth onClick={handleLogin}>
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
