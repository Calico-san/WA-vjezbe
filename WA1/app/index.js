const express = require("express");
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello!");
});


app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    }
    console.log(`Express poslužitelj sluša na portu ${PORT}`);
});
