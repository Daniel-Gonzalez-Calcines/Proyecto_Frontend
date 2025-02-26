import { Card, CardMedia, CardContent, Typography, Dialog, DialogContent, Button, Grid2 } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import DeleteIcon from '@mui/icons-material/Delete';

interface TestimonioProps {
    session: number;
}

const ShowSession: React.FC<TestimonioProps> = ({ session }) => {
    const [open, setOpen] = useState(false);
    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [imageSrc, setImageSrc] = useState('/tracks/Default.jpg');
    const [bestsessionlaps, setBestSessionLaps] = useState<bestlaps[]>([]);

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

    const handleImageClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
        <Card sx={{ maxWidth: 300, margin: '20px auto', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CardMedia
                component="img"
                height="300"
                image={imageSrc}
                alt="circuit"
                onClick={handleImageClick}
                sx={{ cursor: 'pointer', width: '100%', objectFit: 'cover' }}
            />
            <CardContent>
                <Typography>
                    Circuito: {jsonData ? jsonData.sesion.track : "Error while loading"}
                    <br />
                    Número de sesiones: {jsonData ? jsonData.sesion.number_of_sessions : "Error while loading"}
                </Typography>
                {jsonData ? (
                    Array.from({ length: jsonData.sesion.number_of_sessions }, (_, i) => {
                        const bestlap = jsonData.sesion.sessions[i].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
                        const sesionname = jsonData.sesion.sessions[i].name
                        const playername = jsonData.sesion.players[bestlap[0].car].name;
                        return (
                            <Typography>
                                Mejor vuelta de {sesionname}: {formatMilliseconds(bestlap[0].time)} por {playername}
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
                                Circuito: {jsonData ? jsonData.sesion.track : "Error while loading"}
                                <br />
                                Número de sesiones: {jsonData ? jsonData.sesion.number_of_sessions : "Error while loading"}
                            </Typography>
                            {jsonData ? (
                                Array.from({ length: jsonData.sesion.number_of_sessions }, (_, i) => {
                                    const bestlap = jsonData.sesion.sessions[i].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
                                    const sesionname = jsonData.sesion.sessions[i].name
                                    const playername = jsonData.sesion.players[bestlap[0].car].name;
                                    return (
                                        <Typography variant="body1" component="p" sx={{ marginTop: '10px', textAlign: 'center' }}>
                                            Mejor vuelta de {sesionname}: {formatMilliseconds(bestlap[0].time)} por {playername}
                                        </Typography>
                                    );
                                })
                            ) : null}
                        </Grid2>
                        <Grid2 size={1}>
                            <Button>
                                <DeleteIcon sx={{ color: 'red' }} />
                            </Button>
                        </Grid2>
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
                            >
                                Ver estadísticas en detalle
                            </Button>
                        </Grid2>
                    </Grid2>
                </DialogContent>
            </Dialog>
        </Card>
    );

};

export default ShowSession