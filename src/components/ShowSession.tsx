import { Card, CardMedia, CardContent, Typography, Dialog, DialogContent, Button, Grid2, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface SessionProps {
    session: number;
    owner: boolean
}

const ShowSession: React.FC<SessionProps> = ({ session, owner }) => {
    const [open, setOpen] = useState(false);
    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [imageSrc, setImageSrc] = useState('/tracks/Default.jpg');
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false); 

    interface sesiondata {
        track: String;
        players: player[];
        number_of_sessions: number;
        sessions: unique_sesion_data[];
    }

    interface unique_sesion_data {
        laps: laps[];
        name: String;
        type: number;
        event: number;
        bestLaps: bestlaps[];
        duration: number;
        lapsCount: number;
        lapstotal: number[];
        raceResult?: number[];
    }

    interface bestlaps {
        car: number;
        lap: number;
        time: number;
    }

    interface laps {
        car: number;
        lap: number;
        cuts: number;
        time: number;
        tire: String;
        sectors: number[];
    }

    interface player {
        car: String;
        name: String;
        skin: String;
    }

    const toggleLike = () => {
        setLiked(!liked); 
      };

    const handleImageClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const goToStats = () => {
        navigate('/mainStats', { state: { session } });
    }

    function formatMilliseconds(ms: number): string {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, "0")}:${String(
                seconds
            ).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
        } else if (minutes > 0) {
            return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
                milliseconds
            ).padStart(3, "0")}`;
        } else {
            return `${seconds}.${String(milliseconds).padStart(3, "0")}`;
        }
    }

    async function handleDelete(sesionId: number) {
        try {
            const { error: fetchError } = await supabase
                .from('Sessions')
                .delete()
                .eq('id', sesionId)
            if (fetchError) {
                throw fetchError;
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error during deleting sessions:", error);
        }
    }

    useEffect(() => {
        if (jsonData) {
            const imageName = `${jsonData.sesion.track}.jpg`;
            const imagePath = `/tracks/${imageName}`;
            const img = new Image();
            img.src = imagePath;
            img.onload = () => {
                setImageSrc(imagePath);
            };
            img.onerror = () => {
                setImageSrc('/tracks/Default.jpg');
            };
        }
    }, [jsonData]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const { data: sessionData, error: fetchError } = await supabase
                    .from('Sessions')
                    .select('*')
                    .eq('id', session).single();
                if (fetchError) {
                    throw fetchError;
                } else {
                    setjsonData(sessionData);
                }
            } catch (error) {
                console.error("Error during fetching sessions:", error);
            }
        };
        fetchSessions();
    }, []);

    return (
        <Card sx={{ maxWidth: 400, minHeight: 400, minWidth: 400, maxHeight: 400, margin: '20px auto', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CardMedia
                component="img"
                height="250"
                image={imageSrc}
                alt="circuit"
                onClick={handleImageClick}
                sx={{ cursor: 'pointer', width: '100%', objectFit: 'cover' }}
            />
            <CardContent sx={{ overflowY: 'auto' }}>
                <Typography component="span" variant="body1">
                    <Typography component="span" variant="body1" fontWeight="bold">
                        Circuito:
                    </Typography>
                    {jsonData ? jsonData.sesion.track : "Error while loading"}
                </Typography>
                {jsonData ? (
                    Array.from({ length: jsonData.sesion.number_of_sessions }, (_, i) => {
                        const bestlap = jsonData.sesion.sessions[i].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
                        const sesionname = jsonData.sesion.sessions[i].name.toUpperCase()
                        let playername = jsonData.sesion.players[bestlap[0].car].name;
                        const duration = jsonData.sesion.sessions[i].duration
                        const cars = jsonData.sesion.players.length;
                        const laps = jsonData.sesion.sessions[i].lapsCount
                        let str = `Vueltas: ${laps}`;
                        {
                            jsonData.sesion.sessions[i].raceResult ? (
                                playername = jsonData.sesion.players[jsonData.sesion.sessions[i].raceResult[0]].name
                            ) : null
                        }
                        {
                            laps == 0 ? (
                                str = `Tiempo: ${duration}`
                            ) : null
                        }
                        return (
                            <Typography>
                                <Typography component="span" variant="body1" fontWeight="bold">
                                    {sesionname}
                                </Typography>
                                <br />
                                {str}
                                <br />
                                Pilotos: {cars}
                                <br />
                                Ganador: {playername}
                            </Typography>
                        );
                    })
                ) : null}
            </CardContent>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid2 container sx={{ alignItems: 'center' }}>
                        <Grid2 size={12} sx={{ alignItems: 'center' }}>
                            <img
                                src={imageSrc}
                                alt="Circuit"
                                style={{ maxWidth: '90%', maxHeight: '80vh', cursor: 'pointer' }}
                            />
                        </Grid2>
                        <Grid2 size={11}>
                            <Typography variant="body1" component="p" sx={{ marginTop: '10px', textAlign: 'center' }}>
                                <Typography component="span" variant="body1" fontWeight="bold">
                                    Circuito:
                                </Typography>
                                {jsonData ? " " + jsonData.sesion.track : " Error while loading"}
                                <br />
                                <Typography component="span" variant="body1" fontWeight="bold">
                                    Número de sesiones:
                                </Typography>
                                {jsonData ? " " + jsonData.sesion.number_of_sessions : " Error while loading"}
                            </Typography>
                            {jsonData ? (
                                Array.from({ length: jsonData.sesion.number_of_sessions }, (_, i) => {
                                    const bestlap = jsonData.sesion.sessions[i].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
                                    const sesionname = jsonData.sesion.sessions[i].name.toUpperCase()
                                    let playername = jsonData.sesion.players[bestlap[0].car].name;
                                    const duration = jsonData.sesion.sessions[i].duration
                                    const cars = jsonData.sesion.players.length;
                                    const laps = jsonData.sesion.sessions[i].lapsCount
                                    let str = `Vueltas: ${laps}`;
                                    {
                                        jsonData.sesion.sessions[i].raceResult ? (
                                            playername = jsonData.sesion.players[jsonData.sesion.sessions[i].raceResult[0]].name
                                        ) : null
                                    }
                                    {
                                        laps == 0 ? (
                                            str = `Tiempo: ${duration}`
                                        ) : null
                                    }
                                    return (
                                        <>
                                            <Divider />
                                            <Typography textAlign={'center'}>
                                                <Typography component="span" variant="body1" fontWeight="bold">
                                                    {sesionname}
                                                </Typography>
                                                <br />
                                                {str}
                                                <br />
                                                Pilotos: {cars}
                                                <br />
                                                Mejor Vuelta: {formatMilliseconds(bestlap[0].time)} por {jsonData.sesion.players[bestlap[0].car].name}
                                                <br />
                                                Ganador: {playername}
                                            </Typography>
                                        </>
                                    );
                                })
                            ) : null}
                        </Grid2>
                        {!owner ? (
                            <Grid2 size={1}>
                                {liked ? <FavoriteIcon onClick={toggleLike} color="error" /> : <FavoriteBorderIcon onClick={toggleLike} />}
                            </Grid2>
                        ) : (
                            <Grid2 size={1}>
                                <Button onClick={() => handleDelete(session)}>
                                    <DeleteIcon sx={{ color: 'red' }} />
                                </Button>
                            </Grid2>
                        )}
                        <Grid2 size={12} >
                            <Button
                                variant='contained'
                                color='error'
                                sx={{
                                    marginTop: '10px',
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                                onClick={() => goToStats()}
                            >
                                Ver estadísticas en detalle
                            </Button>
                        </Grid2>
                    </Grid2>
                </DialogContent>
            </Dialog >
        </Card >
    );

};

export default ShowSession