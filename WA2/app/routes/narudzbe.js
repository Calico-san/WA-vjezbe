import express from "express";

import { checkArray, pizzaExists } from "../utils/index.js";

const router = express.Router();


let narudzbe = [
    {
        id: 1, 
        narucene_pizze: [
            {id_pizza: 1, kolicina: 2, velicina: "srednja"},
            {id_pizza: 2, kolicina: 1, velicina: "jumbo"}
        ],
        adresa_dostave: "Zagrebačka ulica",
        telefon: "09842349101"
    }
]

let dozvoljene_velicine = ["mala", "srednja", "jumbo"];

router.get('/', (req, res) => {
    res.status(200).json(narudzbe);   // NE ZABORAVITI STATUS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
})

router.post('/', (req, res) => {
    if (!req.body) {
        return res.status(400).json({greska: "HTTP body je prazan."});
    }
    let id_narudzbe = null;
    let nova_narudzba = req.body;

    if (!checkArray(narudzbe)) {
        id_narudzbe = 1;
    } else {
        id_narudzbe = narudzbe.at(-1)['id'] + 1;
    }

    let narucene = nova_narudzba.narucene_pizze;

    narucene.forEach(stavka=> {
        if (!pizzaExists(stavka['id_pizza'])) {
            return res.status(404).json({greska: `Pizza s id-jem ${stavka['id_pizza']} ne postoji`});
        }
        if (!dozvoljene_velicine.includes(stavka.velicina)) {   // stavka["velicina"] i stavka.velicina su ISTO -- dohvaćaju value od key velicina u objektu stavka -- stavka.[] se koristi kad ima razmaka ili znakova npr. stavka.["id_pizze"]
            return res.status(400).json({greska: "Unesena kriva veličina"});
        }
    })
    
    narudzbe.push({id: id_narudzbe, ...nova_narudzba});

    return res.status(201).json(narudzbe);
});

export default router;