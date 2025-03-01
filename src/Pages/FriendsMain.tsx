import { Typography, Card, CardContent, CardMedia, Button, Grid2, TextField } from "@mui/material";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function FriendsMain() {
    const [jsonData, setJsonData] = useState<userData[]>([]);
    const [amigos, setAmigos] = useState<FriendsData>();
    const [userId, setUserId] = useState(-1)
    const [search, setSearch] = useState("")

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
        [x: string]: any;
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
            }
        };
        fetchSessions();
    }, []);

    useEffect(() => {
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].usuario == usuario) {
                setAmigos(jsonData[i].friends)
                setUserId(jsonData[i].id)
                return
            }
        }
    }, [jsonData])

    async function searchFriend(name: string) {
        try {
            const { data: sessionData, error: fetchError } = await supabase
                .from('Usuarios')
                .select('*')
                .ilike('usuario', `%${name}%`)
                .limit(25);

            if (fetchError) {
                throw fetchError;
            } else {
                setJsonData(sessionData || []);
            }
        } catch (error) {
            console.error("Error during fetching sessions:", error);
        }
    }

    async function deleteFriend(userid: number, index: number) {
        if (amigos) {
            amigos.Friends = amigos.Friends.filter(friend => friend !== userid);
        }
        if (jsonData[index].friends) {
            jsonData[index].friends.Friends = jsonData[index].friends.Friends.filter(friend => friend !== userId);
        }
        try {
            const { error: updateError1 } = await supabase
                .from('Usuarios')
                .update({ friends: (jsonData[index].friends) })
                .eq('id', userid);
            if (updateError1) {
                console.error("Error updating user's friends list:", updateError1);
                return;
            }
            const { error: updateError2 } = await supabase
                .from('Usuarios')
                .update({ friends: (amigos) })
                .eq('id', userId);
            if (updateError2) {
                console.error("Error updating current user's friends list:", updateError2);
            }
        } catch (error) {
            console.error("Error during deleteFriend operation:", error);
        }
        window.location.reload();
    }

    async function acceptFriend(userid: number, index: number) {
        if (amigos) {
            amigos.Recived = amigos.Recived.filter(friend => friend !== userid);
            amigos.Friends.push(userid)
        }
        if (jsonData[index].friends) {
            jsonData[index].friends.Send = jsonData[index].friends.Send.filter(friend => friend !== userId);
            jsonData[index].friends.Friends.push(userId)
        }
        try {
            const { error: updateError1 } = await supabase
                .from('Usuarios')
                .update({ friends: (jsonData[index].friends) })
                .eq('id', userid);
            if (updateError1) {
                console.error("Error updating user's friends list:", updateError1);
                return;
            }
            const { error: updateError2 } = await supabase
                .from('Usuarios')
                .update({ friends: (amigos) })
                .eq('id', userId);
            if (updateError2) {
                console.error("Error updating current user's friends list:", updateError2);
            }
        } catch (error) {
            console.error("Error during deleteFriend operation:", error);
        }
        window.location.reload();
    }

    async function requestFriend(userid: number, index: number) {
        if (amigos) {
            amigos.Send.push(userid)
        }
        if (jsonData[index].friends) {
            jsonData[index].friends.Recived.push(userId)
        }
        try {
            const { error: updateError1 } = await supabase
                .from('Usuarios')
                .update({ friends: (jsonData[index].friends) })
                .eq('id', userid);
            if (updateError1) {
                console.error("Error updating user's friends list:", updateError1);
                return;
            }
            const { error: updateError2 } = await supabase
                .from('Usuarios')
                .update({ friends: (amigos) })
                .eq('id', userId);
            if (updateError2) {
                console.error("Error updating current user's friends list:", updateError2);
            }
        } catch (error) {
            console.error("Error during deleteFriend operation:", error);
        }
        window.location.reload();
    }

    return (
        <>
            <Menu />
            <Typography variant="h4">Amigos</Typography>
            <Grid2 container spacing={2} alignItems={"center"}>
                <Grid2 size={3}></Grid2>
                <Grid2 size={6}>
                    <TextField
                        required
                        fullWidth
                        id="Buscar usuario"
                        label="Buscar usuario"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Grid2>
                <Grid2 size={3}>
                    <Button variant="contained" color="error" onClick={() => searchFriend(search)}>
                        Buscar
                    </Button>
                </Grid2>
                {jsonData.length > 0 ? (
                    jsonData.map((user, index) => (
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
                                            <Button color="error" variant="contained" onClick={() => deleteFriend(user.id, index)}>
                                                Eliminar Amigo
                                            </Button>
                                        ) : user.friends?.Send.includes(userId) ? (
                                            <Button variant='contained' color='success' onClick={() => acceptFriend(user.id, index)}>
                                                Aceptar Solicitud
                                            </Button>
                                        ) : amigos?.Send.includes(user.id) ? (
                                            <Button color="error" disabled>
                                                Solicitud enviada
                                            </Button>
                                        ) : (
                                            <Button color='primary' variant="contained" onClick={() => requestFriend(user.id, index)}>
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