import { useState, useEffect } from "react";
import { supabase } from "../../DataBase/SupaBaseClient";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

interface SessionProps {
    session: number;
    sesionid: number;
}

const BestSessionLaps: React.FC<SessionProps> = ({ session, sesionid }) => {

    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [sortedBestLaps, setSortedBestLaps] = useState<bestlaps[] | null>(null)

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
    }, [sesionid])

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

    useEffect(() => {
        if (jsonData)
        setSortedBestLaps(jsonData?.sesion.sessions[sesionid].bestLaps.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time))
    },[jsonData])

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

    function findSector(lap: number, sector: number, car: number){
        if (jsonData)
        for (let i = 0; i < jsonData?.sesion.sessions[sesionid].laps.length; i++) {
            if (jsonData.sesion.sessions[sesionid].laps[i].lap == lap 
                && jsonData.sesion.sessions[sesionid].laps[i].car == car) {
                    return jsonData.sesion.sessions[sesionid].laps[i].sectors[sector]
            }
        }
        return 0
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="Pilotos">
                    <TableHead sx={{ backgroundColor: "darkred" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>Posición</TableCell>
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
                        {sortedBestLaps && sortedBestLaps.length > 0 ? (
                            sortedBestLaps.map((row: bestlaps, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : 'rgb(255, 204, 203)' }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{findDriver(row.car)}</TableCell>
                                    <TableCell>{findCar(row.car)}</TableCell>
                                    <TableCell>{formatMilliseconds(findSector(row.lap, 0, row.car))}</TableCell>
                                    <TableCell>{formatMilliseconds(findSector(row.lap, 1, row.car))}</TableCell>
                                    <TableCell>{formatMilliseconds(findSector(row.lap, 2, row.car))}</TableCell>
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

export default BestSessionLaps;