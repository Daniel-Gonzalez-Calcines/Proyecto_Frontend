import { Typography, CircularProgress, Card, CardContent, CardMedia, Button, Grid2 } from "@mui/material";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function FriendsMain() {
    const [jsonData, setJsonData] = useState<userData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [amigos, setAmigos] = useState<FriendsData>();

    const userData = useSelector((state: RootState) => state.authenticator)
    const usuario = userData.userName

    interface userData {
        id: number;
        usuario: string;
        password: string;
        avatar?: string;
        friends?: FriendsData;
    }

    interface FriendsData {
        Send: number[];
        Friends: number[];
        Recived: number[];
    }

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const { data: sessionData, error: fetchError } = await supabase
                    .from('Usuarios')
                    .select('*')
                    .limit(25);

                if (fetchError) {
                    throw fetchError;
                } else {
                    setJsonData(sessionData || []);
                }
            } catch (error) {
                console.error("Error during fetching sessions:", error);
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    useEffect(() => {
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].usuario == usuario) {
                setAmigos(jsonData[i].friends)
                return
            }
        }
    }, [jsonData])

    if (loading) {
        return (
            <>
                <Menu />
                <Typography>Loading...</Typography>
                <CircularProgress />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Menu />
                <Typography color="error">{error}</Typography>
            </>
        );
    }

    return (
        <>
            <Menu />
            <Typography variant="h4">Amigos</Typography>
            <Grid2 container spacing={2}>
                {jsonData.length > 0 ? (
                    jsonData.map(user => (
                        user.usuario !== usuario ? (
                            <Grid2 size={3} key={user.id}>
                                <Card sx={{ maxWidth: 250, margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        width="250"
                                        image={user.avatar || '/common/perfil-vacio.png'}
                                        alt={`${user.usuario}'s avatar`}
                                    />
                                    <CardContent sx={{ overflowY: 'auto' }}>
                                        <Typography component="span" variant="body1">
                                            {user.usuario || "Unknown User"}
                                            <br />
                                        </Typography>
                                        {amigos?.Friends.includes(user.id) ? (
                                            <Button color="error" variant="contained">
                                                Eliminar Amigo
                                            </Button>
                                        ) : user.friends?.Send.includes(2) ? (
                                            <Button variant='contained' color='success'>
                                                Aceptar Solicitud
                                            </Button>
                                        ) : amigos?.Send.includes(user.id) ? (
                                            <Button color="error" disabled>
                                                Solicitud enviada
                                            </Button>
                                        ) : (
                                            <Button color='primary' variant="contained">
                                                Agregar amigo
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid2>
                        ) : null
                    ))
                ) : (
                    <Typography>No friends found.</Typography>
                )}
            </Grid2>
        </>
    );
}

export default FriendsMain;