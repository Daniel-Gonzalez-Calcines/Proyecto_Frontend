import { Grid2 } from "@mui/material";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { supabase } from "../DataBase/SupaBaseClient";
import ShowSession from "../components/ShowSession";


function ShowPersonalSessions() {

    const [personalSessions, setPersonalSessions] = useState<any[]>([]);
    const userData = useSelector((state: RootState) => state.authenticator);
    const name = userData.userName;

    const getId = async () => {
        const { data } = await supabase
            .from('Usuarios')
            .select('id')
            .eq('usuario', name);
        if (data) {
            return (data[0].id)
        }
        return (0)
    }

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const id = await getId();
                const intId = parseInt(id, 10);

                const { data, error } = await supabase
                    .from('Sessions')
                    .select('id')
                    .eq('user_id', intId);

                if (error) {
                    console.error("Error fetching sessions:", error);
                } else {
                    setPersonalSessions(data);
                }
            } catch (error) {
                console.error("Error during fetching sessions:", error);
            }
        };

        fetchSessions();
    }, [name]);

    return (
        <>
            <Menu />
            <Grid2 container spacing={2} justifyContent="center" alignItems="center" style={{ width: '100vw', margin: '0 auto' }}>
                {personalSessions.map((session) => (
                    <Grid2 sx={{ xs:12, sm:6, md:4 }} >
                        <ShowSession session={session.id} />
                    </Grid2>
                ))}
            </Grid2>
        </>
    )
}

export default ShowPersonalSessions;
