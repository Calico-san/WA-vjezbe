import express from "express";
    //varijabla      //modul 

import path from "path";

const app = express();

const PORT = 3000;

const users = [
    {id: 1, ime:"Ana", prezime: "Anić"},
    {id: 2, ime:"Lea", prezime: "Leić"},
    {id: 3, ime:"Boba", prezime: "Bobić"}
];


app.get('/', (req, res) => {
    let putanja = path.join('public', 'hello.html');
    let aps_putanja = path.resolve(putanja);
    res.sendFile(aps_putanja);
});

app.get('/about', (req, res) => {
    let putanja = path.join('public', 'about.html');
    let aps_putanja = path.resolve(putanja);
    res.sendFile(aps_putanja);
});

app.get('/users', (req, res) => {
    res.json(users); 
});

app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    }
    console.log(`Express poslužitelj sluša na portu ${PORT}`);
});




/* kod iz skripte

const korisnici = [
    {id: 1, ime:"Marko", prezime: "Marić"},
    {id: 2, ime:"Pero", prezime: "Perić"},
    {id: 3, ime:"Stipe", prezime: "Stipić"}
];

endpoint: /
app.get('/', (req, res) => {
    res.send("Hello!"); // slanje teksta
});


app.get('/', (req, res) => {
    let putanja = path.join("public", "error.html");
    let aps_putanja = path.resolve(putanja);
    res.sendFile(aps_putanja); // slanje HTML-a
});

app.get('/korisnici', (req, res) => {
    res.json(korisnici); // slanje JSON-a
});
*/