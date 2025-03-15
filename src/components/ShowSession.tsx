import { Card, CardMedia, CardContent, Typography, Dialog, DialogContent, Button, Grid2, Divider, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface SessionProps {
    session: number;
    owner: boolean;
    id: number
}

const ShowSession: React.FC<SessionProps> = ({ session, owner, id }) => {
    const [open, setOpen] = useState(false);
    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [likedData, setLikedData] = useState<number[]>([])
    const [extrainfo, setextrainfo] = useState<extraInfo | null>(null);
    const [imageSrc, setImageSrc] = useState('/tracks/Default.jpg');
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false);

    interface extraInfo {
        fileName: string,
        ownerName: string,
        uploadDate: string
    }

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

    const toggleLike = async () => {
        likedData.push(id)
        const { error: fetchError } = await supabase
            .from('Sessions')
            .update({ liked: { Liked: likedData } })
            .eq('id', session)
        if (fetchError) {
            throw fetchError;
        }
        setLiked(true);
    };

    const toggleDisLike = async () => {
        const updatedLikedData = likedData.filter(likeId => likeId !== id);
        setLikedData(updatedLikedData);
        const { error: fetchError } = await supabase
            .from('Sessions')
            .update({ liked: { Liked: updatedLikedData } })
            .eq('id', session)
        if (fetchError) {
            throw fetchError;
        }
        setLiked(false);
    }

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
                    .select('sesion')
                    .eq('id', session).single();
                if (fetchError) {
                    throw fetchError;
                } else {
                    setjsonData(sessionData);
                }

                const { data: Data, error: fechtError2 } = await supabase
                    .from('Sessions')
                    .select('liked')
                    .eq('id', session).single()
                if (fechtError2) {
                    throw fechtError2;
                } else {
                    setLikedData(Data.liked ? Data.liked.Liked : [])
                }
            } catch (error) {
                console.error("Error during fetching sessions:", error);
            }
        };
        const Fetchinfo = async () => {
            try {
                const { data: sessionData, error: fetchError } = await supabase
                    .from('Sessions')
                    .select('extraInfo')
                    .eq('id', session)
                    .single();

                if (fetchError) {
                    throw fetchError;
                } else {
                    if (sessionData && sessionData.extraInfo) {
                        setextrainfo(sessionData.extraInfo);
                    }
                }
            } catch (error) {
                console.error("Error during fetching sessions:", error);
            }
        }
        fetchSessions();
        Fetchinfo();
    }, []);

    useEffect(() => {
        if (likedData.includes(id)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [likedData])

    return (
        <Card sx={{ maxWidth: 400, minHeight: 532, minWidth: 400, maxHeight: 400, margin: '20px auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="250px"
                image={imageSrc}
                alt="circuit"
                onClick={handleImageClick}
                sx={{ cursor: 'pointer', width: '100%', objectFit: 'cover' }}
            />
            <CardContent sx={{ overflowY: 'auto' }}>
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="body1" fontWeight="bold" fontSize={'15px'}>
                            {extrainfo?.ownerName}
                        </Typography>
                        <Typography variant="body1" fontSize={'15px'}>
                            {extrainfo?.uploadDate}
                        </Typography>
                    </Box>
                    <Typography component="span" variant="h1" fontWeight="bold" textAlign={'center'} fontSize={'20px'}>
                        {extrainfo?.fileName}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography component="span" variant="body1" fontWeight="bold" textAlign={'left'} fontSize={'15px'}>
                            {jsonData?.sesion.number_of_sessions}
                            {jsonData?.sesion.number_of_sessions === 1 ? ' sesión' : ' sesiones'}
                        </Typography>
                        <Typography component="span" variant="body1" fontWeight="bold" textAlign={'right'} fontSize={'15px'}>
                            {jsonData?.sesion.players.length}
                            {jsonData?.sesion.players.length === 1 ? ' piloto' : ' pilotos'}
                        </Typography>
                    </Box>
                </>
                {jsonData ? (
                    Array.from({ length: jsonData.sesion.number_of_sessions }, (_, i) => {
                        const bestlap = jsonData.sesion.sessions[i].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
                        const sesionname = jsonData.sesion.sessions[i].name.toUpperCase()
                        let playername = jsonData.sesion.players[bestlap[0].car].name;
                        {
                            jsonData.sesion.sessions[i].raceResult ? (
                                playername = jsonData.sesion.players[jsonData.sesion.sessions[i].raceResult[0]].name
                            ) : null
                        }
                        return (
                            <>
                                <Typography component="span" variant="body1" fontWeight="bold">
                                    {sesionname}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Typography component="span" variant="body1" fontWeight="bold" textAlign={'left'} fontSize={'15px'}>
                                        Ganador:
                                    </Typography>
                                    <Typography component="span" variant="body1" textAlign={'left'} fontSize={'15px'} sx={{ marginLeft: '8px' }}>
                                        {playername}
                                    </Typography>
                                </Box>
                            </>
                        );
                    })
                ) : null}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', marginTop: '8px' }}>
                    {liked ? (
                        <>
                            <FavoriteIcon onClick={toggleDisLike} color="error" />
                            <Typography color='error' fontWeight={'bold'} sx={{ marginLeft: '4px' }}>
                                {likedData.length}{likedData.length === 0 ? "" : likedData.length === 1 ? " Like" : " Likes"}
                            </Typography>
                        </>
                    ) : (
                        <>
                            <FavoriteBorderIcon onClick={toggleLike} />
                            <Typography color='black' fontWeight={'bold'} sx={{ marginLeft: '4px' }}>
                                {likedData.length}{likedData.length === 0 ? "" : likedData.length === 1 ? " Like" : " Likes"}
                            </Typography>
                        </>
                    )}
                </Box>
            </CardContent>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Grid2 container sx={{ alignItems: 'center' }}>
                        <Grid2 size={12} sx={{ alignItems: 'center' }}>
                            <img
                                src={imageSrc}
                                alt="Circuit"
                                style={{ maxWidth: '100%', maxHeight: '80vh' }}
                            />
                        </Grid2>
                        <Grid2 size={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography variant="body1" fontWeight="bold" fontSize={'15px'}>
                                    {extrainfo?.ownerName}
                                </Typography>
                                <Typography variant="body1" fontSize={'15px'}>
                                    {extrainfo?.uploadDate}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '10px 0' }}>
                                <Typography component="span" variant="h1" fontWeight="bold" textAlign={'center'} fontSize={'20px'}>
                                    {extrainfo?.fileName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography component="span" variant="body1" fontWeight="bold" textAlign={'left'} fontSize={'15px'}>
                                    {jsonData?.sesion.number_of_sessions}
                                    {jsonData?.sesion.number_of_sessions === 1 ? ' sesión' : ' sesiones'}
                                </Typography>
                                <Typography component="span" variant="body1" fontWeight="bold" textAlign={'right'} fontSize={'15px'}>
                                    {jsonData?.sesion.players.length}
                                    {jsonData?.sesion.players.length === 1 ? ' piloto' : ' pilotos'}
                                </Typography>
                            </Box>
                            {jsonData ? (
                                Array.from({ length: jsonData.sesion.number_of_sessions }, (_, i) => {
                                    const bestlap = jsonData.sesion.sessions[i].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
                                    const sesionname = jsonData.sesion.sessions[i].name.toUpperCase()
                                    let playername = jsonData.sesion.players[bestlap[0].car].name;
                                    const duration = jsonData.sesion.sessions[i].duration
                                    const laps = jsonData.sesion.sessions[i].lapsCount
                                    let str = laps;
                                    {
                                        jsonData.sesion.sessions[i].raceResult ? (
                                            playername = jsonData.sesion.players[jsonData.sesion.sessions[i].raceResult[0]].name
                                        ) : null
                                    }
                                    {
                                        laps == 0 ? (
                                            str = duration
                                        ) : null
                                    }
                                    return (
                                        <>
                                            <Divider />
                                            <Typography textAlign={'center'}>
                                                <Typography component="span" variant="body1" fontWeight="bold">
                                                    {sesionname}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <Typography component="span" variant="body1" fontWeight="bold" textAlign={'left'} fontSize={'15px'}>
                                                        {laps === 0 ? "Tiempo: " : "Vueltas: "}
                                                    </Typography>
                                                    <Typography component="span" variant="body1" textAlign={'left'} fontSize={'15px'} sx={{ marginLeft: '8px' }}>
                                                        {str}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <Typography component="span" variant="body1" fontWeight="bold" textAlign={'left'} fontSize={'15px'}>
                                                        Mejor Vuelta:
                                                    </Typography>
                                                    <Typography component="span" variant="body1" textAlign={'left'} fontSize={'15px'} sx={{ marginLeft: '8px' }}>
                                                        {formatMilliseconds(bestlap[0].time)} por {jsonData.sesion.players[bestlap[0].car].name}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                    <Typography component="span" variant="body1" fontWeight="bold" textAlign={'left'} fontSize={'15px'}>
                                                        Ganador:
                                                    </Typography>
                                                    <Typography component="span" variant="body1" textAlign={'left'} fontSize={'15px'} sx={{ marginLeft: '8px' }}>
                                                        {playername}
                                                    </Typography>
                                                </Box>
                                            </Typography>
                                        </>
                                    );
                                })
                            ) : null}
                        </Grid2>
                        <Grid2 size={3}></Grid2>
                        <Grid2 size={6} >
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
                        {!owner ? (
                            <Grid2 container direction="column" alignItems="center" size={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                    {liked ? (
                                        <>
                                            <FavoriteIcon onClick={toggleDisLike} color="error" cursor='pointer'/>
                                            <Typography color='error' fontWeight={'bold'} sx={{ marginLeft: '4px' }}>
                                                {likedData.length}{likedData.length === 0 ? "" : likedData.length === 1 ? " Like" : " Likes"}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <FavoriteBorderIcon onClick={toggleLike} cursor='pointer'/>
                                            <Typography color='black' fontWeight={'bold'} sx={{ marginLeft: '4px' }}>
                                                {likedData.length}{likedData.length === 0 ? "" : likedData.length === 1 ? " Like" : " Likes"}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Grid2>
                        ) : (
                            <Grid2 size={3}>
                                <Button onClick={() => handleDelete(session)}>
                                    <DeleteIcon sx={{ color: 'red' }} />
                                </Button>
                            </Grid2>
                        )}
                    </Grid2>
                </DialogContent>
            </Dialog >
        </Card >
    );

};

export default ShowSession