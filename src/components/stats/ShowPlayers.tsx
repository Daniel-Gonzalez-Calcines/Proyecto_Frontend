import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../../DataBase/SupaBaseClient";

interface SessionProps {
    session: number;
}

const ShowPlayers: React.FC<SessionProps> = ({ session }) => {

    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);

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
            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="Pilotos">
                    <TableHead sx={{ backgroundColor: "darkred" }}>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{ color: "white" }}>Nombre</TableCell>
                            <TableCell sx={{ color: "white" }}>Coche</TableCell>
                            <TableCell sx={{ color: "white" }}>Skin</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jsonData?.sesion.players && jsonData?.sesion.players.length > 0 ? (
                            jsonData?.sesion.players.map((row: player, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : 'rgb(255, 204, 203)' }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.car}</TableCell>
                                    <TableCell>{row.skin}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Cargando Datos
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ShowPlayers