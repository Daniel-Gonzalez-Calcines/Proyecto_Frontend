import { Card, CardMedia, CardContent, Typography, Dialog, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";

interface TestimonioProps {
    session: number;
}

const ShowSession: React.FC<TestimonioProps> = ({ session }) => {
    const [open, setOpen] = useState(false);
    const [jsonData, setjsonData] = useState<{ sesion: sesion } | null>(null);

    interface sesion {
        track: String;
        players: player[];
        number_of_sessions: number;
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
        const fetchSessions = async () => {
            try {
                const { data: sessionData, error: fetchError } = await supabase
                    .from('Sessions')
                    .select('*')
                    .eq('id', 14).single();
                if (fetchError) {
                    throw fetchError;
                } else {
                    setjsonData(sessionData);
                }
            } catch (error) {
                console.error("Error during fetching sessions:", error);
            }
        };
        console.log(session);
        fetchSessions();
    }, []);

    return (
        <Card sx={{ maxWidth: 300, margin: '20px auto', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CardMedia
                component="img"
                height="300"
                image={`/tracks/${jsonData ? jsonData.sesion.track : "Default"}.jpg`}
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
                    <img
                        src={`/tracks/${jsonData ? jsonData.sesion.track : "Default"}.jpg`}
                        alt="Circuit"
                        style={{ maxWidth: '90%', maxHeight: '80vh', cursor: 'pointer' }}
                    />
                    <Typography variant="body1" component="p" sx={{ marginTop: '10px' }}>
                        Circuito
                        <br />
                        {jsonData ? jsonData.sesion.track : "Error while loading"}
                        <br />
                        Número de sesiones
                        <br />
                        {jsonData ? jsonData.sesion.number_of_sessions : "Error while loading"}
                    </Typography>
                </DialogContent>
            </Dialog>
        </Card>
    );

};

export default ShowSession