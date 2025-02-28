import { useState, useEffect } from "react";
import { supabase } from "../../DataBase/SupaBaseClient";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

interface SessionProps {
    session: number;
    sesionid: number;
}

const AllSessionLaps: React.FC<SessionProps> = ({ session, sesionid }) => {

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

    function findDriver(car: number) {
        return jsonData?.sesion.players[car].name
    }

    function findCar(car: number) {
        return jsonData?.sesion.players[car].car
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="Pilotos">
                    <TableHead sx={{ backgroundColor: "darkred" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Piloto</TableCell>
                            <TableCell sx={{ color: "white" }}>Coche</TableCell>
                            <TableCell sx={{ color: "white" }}>Sector 1</TableCell>
                            <TableCell sx={{ color: "white" }}>Sector 2</TableCell>
                            <TableCell sx={{ color: "white" }}>Sector 3</TableCell>
                            <TableCell sx={{ color: "white" }}>Tiempo</TableCell>
                            <TableCell sx={{ color: "white" }}>Vuelta</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jsonData?.sesion.sessions[sesionid].laps && jsonData?.sesion.sessions[sesionid].laps.length > 0 ? (
                            jsonData?.sesion.sessions[sesionid].laps.map((row: laps, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : 'rgb(255, 204, 203)' }}
                                >
                                    <TableCell>{findDriver(row.car)}</TableCell>
                                    <TableCell>{findCar(row.car)}</TableCell>
                                    <TableCell>{formatMilliseconds(row.sectors[0])}</TableCell>
                                    <TableCell>{formatMilliseconds(row.sectors[1])}</TableCell>
                                    <TableCell>{formatMilliseconds(row.sectors[2])}</TableCell>
                                    <TableCell>{formatMilliseconds(row.time)}</TableCell>
                                    <TableCell>{row.lap + 1}</TableCell>
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

export default AllSessionLaps;