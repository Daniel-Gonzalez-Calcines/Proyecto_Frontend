import { Button, Grid2, Typography } from "@mui/material";
import { useState } from "react";
import Menu from "../components/Menu";
import { supabase } from "../DataBase/SupaBaseClient";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";

function Upload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate()

    const userData = useSelector((state: RootState) => state.authenticator)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const loadData = async () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const jsonData = JSON.parse(event.target?.result as string);
                    console.log(jsonData.sessions[0].laps[0].car)

                    const id = await getId();
                    const intId = parseInt(id, 10);

                    const { error } = await supabase
                        .from('Sessions')
                        .insert([{ sesion: jsonData, user_id: intId }]);

                    if (error) {
                        console.error('Error inserting user:', error);
                    } else {
                        navigate('/ShowPersonalSessions');
                    }

                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
            reader.readAsText(selectedFile);
        }
    };

    const UploadFile = async () => {
        const id = await getId();
        const intId = parseInt(id, 10);
        const { data } = await supabase
            .from('Sessions')
            .select('*')
            .eq('user_id', intId);

        const exists = data && data.length < 25;

        if (exists) {
            loadData();
        }
    }

    const getId = async () => {
        const { data } = await supabase
            .from('Usuarios')
            .select('id')
            .eq('usuario', userData.userName);
        if (data) {
            return (data[0].id)
        }
        return (0)
    }

    return (
        <>
            <Menu />

            <Grid2 container spacing={2} rowSpacing={1}>
                <Grid2 size={12}>
                    <Typography variant="h2" color="white">
                        Lector de archivo de resultado de Assetto Corsa
                    </Typography>
                </Grid2>
                <Grid2 size={12}>
                    <input type="file" accept=".json" onChange={handleFileChange} />
                    {selectedFile && (
                        <div>
                            <h3>Selected File:</h3>
                            <p>{selectedFile.name}</p>
                        </div>
                    )}
                </Grid2>
                {selectedFile ? (
                    <Grid2 size={12}>
                        <Button onClick={() => UploadFile()} color='error' variant='contained'>Subir archivo</Button>
                    </Grid2>
                ) : null}
            </Grid2>
        </>
    );
}

export default Upload;