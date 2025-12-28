import express from "express";
import path from "path";

import { checkArray, sameArrays } from "./utils/index.js";

import pizze_router from "./routes/pizze.js";
import narudzbe_router from "./routes/narudzbe.js"

const app = express();  // glavna express aplikacija
const PORT = 3000;

app.use(express.json());  // ukljucivanje middleware express.json()
app.use("/pizze", pizze_router);  // /pizze prefiks -- u pizze.js maknuti /pizze jer je tu sad definirano za sve rute
app.use('/narudzbe', narudzbe_router);

app.listen(PORT, error => {
    if (error) {
        console.error('Greška pri pokretanju poslužitelja');
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
});



app.get('/', (req, res) => {
    let putanja = path.resolve('public', 'index.html');
    res.status(200).sendFile(putanja);
});



