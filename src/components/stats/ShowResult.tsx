import { useState, useEffect } from "react";
import { supabase } from "../../DataBase/SupaBaseClient";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

interface SessionProps {
    session: number;
    sesionid: number;
}

const ShowResult: React.FC<SessionProps> = ({ session, sesionid }) => {

    const [jsonData, setjsonData] = useState<{ sesion: sesiondata } | null>(null);
    const [sortedResult, setSortedResult] = useState<sorted_result[] | null>(null);
    let statsOfFirst = [0,0]
    let differenceAhead = [-1, -1, -1]

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

    useEffect(() => {
        const unsortedResult: sorted_result[] = [];
        if (jsonData)
            for (let i = 0; i < jsonData?.sesion.sessions[sesionid].raceResult.length; i++) {
                let carid = jsonData?.sesion.sessions[sesionid].raceResult[i]
                let name = findDriver(carid) as string
                let car = findCar(carid) as string
                let time = getTotalTime(carid)
                let laps = getTotalLaps(carid)
                unsortedResult.push({ Piloto: name, Coche: car, Tiempo: time, Vueltas: laps })
            }
        if (unsortedResult)
            unsortedResult.sort((a: sorted_result, b: sorted_result) => {
                if (a.Vueltas !== b.Vueltas) {
                    return b.Vueltas - a.Vueltas;
                }
                return a.Tiempo - b.Tiempo;
            });

        setSortedResult(unsortedResult)
    }, [jsonData])

    interface sorted_result {
        Piloto: string;
        Coche: string;
        Tiempo: number;
        Vueltas: number;
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
        raceResult: number[];
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

    function getTotalTime(car: number) {
        let totalTime = 0;
        if (jsonData)
            for (let i = 0; i < jsonData?.sesion.sessions[sesionid].laps.length; i++) {
                if (jsonData.sesion.sessions[sesionid].laps[i].car == car) {
                    totalTime += jsonData.sesion.sessions[sesionid].laps[i].time
                }
            }
        if (differenceAhead[0] == -1) {
            differenceAhead[0] = totalTime
        }
        differenceAhead[1] = totalTime
        return totalTime;
    }

    function getDifference(row: sorted_result) {
        if (statsOfFirst[0] == 0) {
            statsOfFirst=[row.Vueltas, row.Tiempo]
            return 0
        } else if (statsOfFirst[0] == row.Vueltas) {
            return formatMilliseconds(row.Tiempo - statsOfFirst[1])
        } else {
            return (statsOfFirst[0] - row.Vueltas + " vueltas")
        }
    }

    function getTotalLaps(car: number) {
        let totalLaps = 0;
        if (jsonData)
            for (let i = 0; i < jsonData?.sesion.sessions[sesionid].laps.length; i++) {
                if (jsonData.sesion.sessions[sesionid].laps[i].car == car) {
                    totalLaps += 1
                }
            }
        if (differenceAhead[2] == -1) {
            differenceAhead[2] = totalLaps
        }
        differenceAhead[3] = totalLaps
        return totalLaps;
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
                            <TableCell sx={{ color: "white" }}>Tiempo Total</TableCell>
                            <TableCell sx={{ color: "white" }}>Vueltas completadas</TableCell>
                            <TableCell sx={{ color: "white" }}>Diferecia</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedResult && sortedResult.length > 0 ? (
                            sortedResult.map((row: sorted_result, index: number) => (
                                <TableRow
                                    key={index}
                                    sx={{ backgroundColor: index % 2 === 0 ? 'white' : 'rgb(255, 204, 203)' }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.Piloto}</TableCell>
                                    <TableCell>{row.Coche}</TableCell>
                                    <TableCell>{formatMilliseconds(row.Tiempo)}</TableCell>
                                    <TableCell>{row.Vueltas}</TableCell>
                                    <TableCell>+ {getDifference(row)}</TableCell>
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

export default ShowResult