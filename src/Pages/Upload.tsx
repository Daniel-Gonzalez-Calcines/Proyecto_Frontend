import { Grid2, Typography } from "@mui/material";
import { useState } from "react";
import Menu from "../components/Menu";

function Upload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    };

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
            </Grid2>
        </>
    );
}

export default Upload;
