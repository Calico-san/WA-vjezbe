import express from "express";

import zaposlenici_router from "./routes/zaposlenici.js";

const app = express(); 
const PORT = 3000;

app.use(express.json());  
app.use("/zaposlenici", zaposlenici_router);

app.listen(PORT, error => {
    if (error) {
        console.error('Greška pri pokretanju poslužitelja');
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Bok!');
})




