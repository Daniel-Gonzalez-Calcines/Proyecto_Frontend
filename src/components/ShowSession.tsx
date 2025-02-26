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

    interface sesiondata {
        track: String;
        players: player[];
        number_of_sessions: number;
        sessions: sesion[];
    }

    interface sesion {
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
                <Typography variant="h5" component="h4">
                    Circuito
                    <br />
                    {jsonData ? jsonData.sesion.track : "Error while loading"}
                    <br />
                    Número de sesiones
                    <br />
                    {jsonData ? jsonData.sesion.number_of_sessions : "Error while loading"}
                </Typography>
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
                        </Grid2>
                        <Grid2 size={1}>
                            <Button>
                                <DeleteIcon sx={{ color: 'red' }} />
                            </Button>
                        </Grid2>
                    </Grid2>
                </DialogContent>
            </Dialog>
        </Card>
    );

};

export default ShowSession