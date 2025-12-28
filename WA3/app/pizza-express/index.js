import express from "express";
import pizzeRouter from './routes/pizze.js';


const app = express(); 
const PORT = 3000;

app.use(express.json());  

app.use('/pizze', pizzeRouter); // dodavanje prefiksa "/pizze" za svaki endpoint iz pizze.js Routera

app.listen(PORT, error => {
    if (error) {
        console.error('Greška pri pokretanju poslužitelja');
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Dobrodošli u Pizza Express poslužitelj!');
})

