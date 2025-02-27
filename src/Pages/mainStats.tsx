import { Button, Grid2 } from "@mui/material"
import Menu from "../components/Menu";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from "../DataBase/SupaBaseClient";
import ShowPlayers from "../components/stats/ShowPlayers";

function MainStats() {
    const location = useLocation();
    const { session } = location.state || {};
    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [showData, setShowData] = useState<number>(0)

    function changeShowData(show: number) {
        setShowData(show)
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
            <Button color='error' variant="contained" onClick={() => changeShowData(0)}>
                Lista de jugadores
            </Button>
            {jsonData?.sesion.sessions.map((session) => (
                <Grid2 container spacing={2} style={{ width: '100vw', margin: '10 auto' }} key={session.event}>
                    <Grid2 size ={12}></Grid2>
                    <Grid2 size={3}>
                        <Button color='error' variant='contained'>
                            Vueltas de {session.name}
                        </Button>
                    </Grid2>
                    {session.raceResult ? (
                        <Grid2 size={3}>
                            <Button color='error' variant='contained'>
                                Mejores vueltas de {session.name}
                            </Button>
                        </Grid2>
                    ) : <br />}
                    {session.raceResult ? (
                        <Grid2 size={3}>
                            <Button color='error' variant='contained'>
                                Resultado de {session.name}
                            </Button>
                        </Grid2>
                    ) : <Grid2 size={3}>
                            <Button color='error' variant='contained'>
                                Resultado de {session.name}
                            </Button>
                        </Grid2>
                    }
                </Grid2>
            ))}
            {showData == 0 ? (
                <ShowPlayers session={session} />
            ):null}
        </>
    )
}

export default MainStats;