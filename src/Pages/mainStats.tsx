import { Button, Divider, Grid2, Typography } from "@mui/material"
import Menu from "../components/Menu";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import ShowPlayers from "../components/stats/ShowPlayers";
import AllSessionLaps from "../components/stats/AllSessionLaps";
import BestSessionLaps from "../components/stats/BestSessionLaps";
import ShowResult from "../components/stats/ShowResult";

function MainStats() {
    const location = useLocation();
    const { session } = location.state || {};
    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [showData, setShowData] = useState<number>(0)
    const [showSession, setShowSession] = useState<number>(0)

    function changeShowData(showtable: number, showsesion: number) {
        setShowSession(showsesion)
        setShowData(showtable)
    }

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
    }, [])

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

    return (
        <>
            <Menu />
            <br />
            <Button color={showData === 0 ? 'primary' : 'error'} variant="contained" onClick={() => changeShowData(0, 0)}>
                Lista de jugadores
            </Button>
            {jsonData?.sesion.sessions.map((session, index) => (
                <Grid2 container spacing={2} style={{ width: '100vw', margin: '10 auto' }} key={index}>
                    <Divider/>
                    <Grid2 size={12}>
                        <Typography variant="h5" fontWeight={'bold'}>
                            {session.name}
                        </Typography>
                    </Grid2>
                    <Grid2 size={3}>
                        <Button color={showData === 1 && showSession === index ? 'primary' : 'error'}  variant='contained' fullWidth onClick={() => changeShowData(1, index)}>
                            Vueltas de {session.name}
                        </Button>
                    </Grid2>
                    {session.raceResult ? (
                        <Grid2 size={3}>
                            <Button color={showData === 2 && showSession === index ? 'primary' : 'error'} variant='contained' fullWidth onClick={() => changeShowData(2, index)}>
                                Mejores vueltas de {session.name}
                            </Button>
                        </Grid2>
                    ) : null}
                    {session.raceResult ? (
                        <Grid2 size={3}>
                            <Button color={showData === 3 && showSession === index ? 'primary' : 'error'} variant='contained' fullWidth  onClick={() => changeShowData(3, index)}>
                                Resultado de {session.name}
                            </Button>
                        </Grid2>
                    ) : <Grid2 size={3}>
                            <Button color={showData === 2 && showSession === index ? 'primary' : 'error'} variant='contained' fullWidth  onClick={() => changeShowData(2, index)}>
                                Resultado de {session.name}
                            </Button>
                        </Grid2>
                    }
                </Grid2>
            ))}
            {(() => {
                switch (showData) {
                    case 0:
                        return <ShowPlayers session={session} />;
                    case 1:
                        return <AllSessionLaps session={session} sesionid={showSession}/>;
                    case 2:
                        return <BestSessionLaps session={session} sesionid={showSession}/>;
                    case 3:
                        return <ShowResult session={session} sesionid={showSession}/>;
                }
            })()}
        </>
    )
}

export default MainStats;