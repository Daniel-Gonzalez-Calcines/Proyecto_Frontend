import { Grid2 } from "@mui/material";
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { supabase } from "../DataBase/SupaBaseClient";
import ShowSession from "../components/ShowSession";


function ShowPublicSessions() {

    const [personalSessions, setPersonalSessions] = useState<any[]>([]);
    const userData = useSelector((state: RootState) => state.authenticator);
    const [amigos, setAmigos] = useState<FriendsData>();

    interface FriendsData {
        [x: string]: any;
        Send: number[];
        Friends: number[];
        Recived: number[];
    }

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

    async function getFriends(id: number) {
        const { data, error } = await supabase
            .from('Usuarios')
            .select('friends')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching friends:', error);
        } else {
            setAmigos(data?.friends || null);
        }
    }

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const id = await getId();
                const intId = parseInt(id, 10);
                getFriends(intId)

                const { data, error } = await supabase
                    .from('Sessions')
                    .select('*')
                    .neq('user_id', intId);

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
                    amigos?.Friends.includes(session.user_id) ? (
                        <Grid2 sx={{ xs: 12, sm: 6, md: 4 }} >
                            <ShowSession session={session.id} owner={false} />
                        </Grid2>
                    ) : null
                ))}
            </Grid2>
        </>
    )
}

export default ShowPublicSessions;
