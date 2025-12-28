import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, error => {
    if (error) {
        console.error("Greška pri pokretanju poslužitelja");
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
});

const pizze = [
{ id: 1, naziv: 'Margherita', cijena: 6.5 },
{ id: 2, naziv: 'Capricciosa', cijena: 8.0 },
{ id: 3, naziv: 'Quattro formaggi', cijena: 10.0 },
{ id: 4, naziv: 'Šunka sir', cijena: 7.0 },
{ id: 5, naziv: 'Vegetariana', cijena: 9.0 }
];


app.get('/', (req, res) => {
    let putanja = path.resolve("public", "index.html");
    res.sendFile(putanja);
});

app.get('/pizze', (req, res) => {
    res.json(pizze);
});


app.get('/pizze/:naziv', (req, res) => {
    let naziv_pizze = req.params.naziv;

    let trazena_pizza = pizze.find(pizza => pizza.naziv == naziv_pizze);  
    
    if (trazena_pizza) {
        return res.json(trazena_pizza);  
    }

    return res.json({poruka: "Tražena pizza ne postoji"});
});


app.post('/pizze', (req, res) => {


    if (!req.body) {
        return res.json({greska: "HTTP body je prazan!"});
    };

    let dodavanje_pizze = req.body;

    let postojeca = pizze.find(pizza => pizza.naziv == dodavanje_pizze.naziv);

    if (postojeca) {
        return res.json({greska: `Pizza s nazivom ${dodavanje_pizze.naziv} već postoji!`})
    }

    const novi_id = pizze.at(-1)['id'] + 1; 

    pizze.push({id: novi_id, ...dodavanje_pizze});
    return res.json(pizze);
});

app.delete('/pizze/:naziv', (req, res) => {
    let naziv_brisanje = req.params.naziv;
    let pizza_za_brisanje_index = pizze.findIndex(pizza => pizza.naziv == naziv_brisanje);

    if (pizza_za_brisanje_index == -1) {
        return res.json({greska: `Pizza naziva ${naziv_brisanje} ne postoji`})
    }

    pizze.splice(pizza_za_brisanje_index, 1);

    return res.json(pizze);

});


app.put('/pizze/:naziv', (req, res) => {
    let naziv_zamjena = req.params.naziv;

    if (!req.body) {
        return res.json({greska: "HTTP body je prazan!"});
    };

    let nova_pizza = req.body;

    let pizza_zamjena = pizze.find(pizza => pizza.naziv == naziv_zamjena);  

    if (!pizza_zamjena) {
        return res.json({greska: `Pizza ${naziv_zamjena} ne postoji!`})
    }
    
    let pizza_zamjena_index = pizze.indexOf(pizza_zamjena); 

    let postojeci_id = pizza_zamjena.id;  

    pizze.splice(pizza_zamjena_index, 1, {id: postojeci_id, ...nova_pizza})  

    return res.json(pizze);
});


app.patch('/pizze/:id', (req, res) => {
    let id_pizze = req.params.id;
    
    if (!req.body) {
        return res.json({greska: "HTTP body je prazan!"});
    };

    let { cijena } = req.body;  

    let pizza_azuriranje_index = pizze.findIndex(pizza => pizza.id == id_pizze);

    if (pizza_azuriranje_index== -1) {
        return res.json({greska: `Pizza id ${id_pizze} ne postoji`})
    }

    pizze[pizza_azuriranje_index].cijena = cijena;

    return res.json(pizze);
});

let narudzbe = [];

let vrste_pizza = [];
for (let pizza of pizze) {
    vrste_pizza.push(pizza.naziv);
}

console.log(vrste_pizza);

app.post('/naruci', (req, res) => {
    if (!req.body) {
        res.json({greska: "HTTP body je prazan!"});
    }

    let narudzba = req.body;
    let odabrane_pizze = [];

    for (let stavka of narudzba) {

        if (!stavka.pizza || !stavka.velicina || !stavka.kolicina) {
            return res.json({greska: "Nisu uneseni svi podaci!"})
        }
        if (!(vrste_pizza.includes(stavka.pizza))) {
            return res.json({greska: "Jedna od naručenih pizza ne postoji"})
        }
        odabrane_pizze.push(stavka.pizza)
    }

    narudzbe.push(narudzba);
    return res.json({poruka: `Uspješna narudžba za pizze ${odabrane_pizze}`});


});