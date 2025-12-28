import express from "express";
import { checkArray, sameArrays } from "../utils/index.js";  // sad iz parent direktorija!!!!!!
import { pizze } from "../data/pizze_data.js";


const router = express.Router();  // zamijeniti app s router!!!!!!!!!!!!!!!!

const nazivi_pizza = pizze.map(pizza => pizza.naziv);

let dozvoljeni_kljucevi = ["naziv", "cijena"];

router.get('/', (req, res) => {
    if (!checkArray(pizze)) {
        return res.status(500).json({greska: "Podacima se ne može pristupiti."})  // Greška na serveru
    }
    return res.status(200).json(pizze);  // OK
});


/*  bolje je koristiti array.find ispod  
 
router.get('/pizze/:naziv', (req, res) => {
    let naziv_pizze = req.params.naziv;

    for (let pizza of pizze) {   // trazimo objekt unutar polja
        if (pizza.naziv == naziv_pizze) {   // mora biti ==, ne = !!!!!!!!!!!!!!!!!!!!!!!!!!!!
            res.json(pizza);
        }
    }
    res.json({poruka: 'Tražena pizza ne postoji'});
}); */


// URL PARAMETAR
router.get('/:naziv', (req, res) => {
    if (!checkArray(pizze)) {
        return res.status(500).json({greska: "Podacima se ne može pristupiti."})  // Greška na serveru
    }

    let naziv_pizze = req.params.naziv;

    if (!isNaN(naziv_pizze)) {        // Greška na strani korisnika
        return res.status(400).json({greska: "Neispravan podatak"})
    }

    let trazena_pizza = pizze.find(pizza => pizza.naziv == naziv_pizze);  // ==!!!
    
    if (trazena_pizza) {
        return res.status(200).json(trazena_pizza);  // mora ici return jer se inace ne prekida izvrsavanje funkcije!!
    }

    return res.status(404).json({poruka: "Tražena pizza ne postoji"});   // Not found
});

// Podaci se šalju putem request objekta tj. u HTTP tijelu zahtjeva (HTTP body)
router.post('/', (req, res) => {

    // provjera praznog HTTP bodyja

    if (!req.body) {
        return res.status(400).json({greska: "HTTP body je prazan!"});
    };

    let dodavanje_pizze = req.body;

    // provjera polja objekta

    let kljucevi_pizze= Object.keys(dodavanje_pizze);

    if (!sameArrays(dozvoljeni_kljucevi, kljucevi_pizze)) {
        return res.status(400).json({greska: "Ključevi se ne podudaraju."});
    }

    // provjera duplikata

    let postojeca = pizze.find(pizza => pizza.naziv == dodavanje_pizze.naziv);

    if (postojeca) {
        return res.status(400).json({greska: `Pizza s nazivom ${dodavanje_pizze.naziv} već postoji!`})
    }

    const novi_id = pizze.at(-1)['id'] + 1; // .at dohvaća zadnji element u polju, ['id'] vraća samo id

    /*
    let nova_pizza = {
        id: novi_id,
        naziv: dodavanje_pizze.naziv,
        cijena: dodavanje_pizze.cijena
    };

    umjesto ovog gore koristiti spread operator ( ... ) - rastavi element, extracta ključ vrijednost parove i pohrani u novi objekt */

    pizze.push({id: novi_id, ...dodavanje_pizze});
    nazivi_pizza.push(dodavanje_pizze.naziv);  // azurira popis naziva pizza
    return res.status(201).json(pizze);  // CREATED 
});

router.delete('/:naziv', (req, res) => {
    let naziv_brisanje = req.params.naziv;

    if (!isNaN(naziv_brisanje) || !nazivi_pizza.includes(naziv_brisanje)) {   // Neispravan podatak će se javiti samo ako naziv pizze nije u listi, koja se ne mijenja jer je definirana gore!!
        return res.status(400).json({greska: "Neispravan podatak"});
    }
    let pizza_za_brisanje_index = pizze.findIndex(pizza => pizza.naziv == naziv_brisanje);

    if (pizza_za_brisanje_index == -1) {
        return res.status(404).json({greska: `Pizza naziva ${naziv_brisanje} ne postoji`})
    }

    pizze.splice(pizza_za_brisanje_index, 1);

    return res.status(204).json(pizze);   // 204: NO CONTENT -- zbog 204 se ne vraća json pizza

});


// zamjena jedne postojeće pizze (URL parametar) s drugom (HTTP body) 

router.put('/:naziv', (req, res) => {
    let naziv_zamjena = req.params.naziv;

    if (!isNaN(naziv_zamjena) || !nazivi_pizza.includes(naziv_zamjena)) {
        return res.status(400).json({greska: "Neispravan podatak"});
    }

    if (!req.body) {
        return res.status(400).json({greska: "HTTP body je prazan!"});
    };

    let nova_pizza = req.body;
    let nova_pizza_kljucevi = Object.keys(nova_pizza);
    let nova_pizza_cijena = req.body.cijena;

    if (nova_pizza_cijena <= 0) {
        return res.status(400).json({greska: "Cijena pizze mora biti veća od 0."})
    }

    if (!sameArrays(dozvoljeni_kljucevi, nova_pizza_kljucevi)) {
        return res.status(400).json({greska: "Ključevi se ne podudaraju."});
    }

    let pizza_zamjena = pizze.find(pizza => pizza.naziv == naziv_zamjena);  // pazi na == !!!!!!!!!!!!!!!!

    if (!pizza_zamjena) {
        return res.status(404).json({greska: `Pizza ${naziv_zamjena} ne postoji!`})
    }
    
    let pizza_zamjena_index = pizze.indexOf(pizza_zamjena); // ili koristiti pizze.findIndex

    let postojeci_id = pizza_zamjena.id;  // sacuvali ID

    /* 
    let novi_zapis = {
        id: postojeci_id,
        naziv: nova_pizza.naziv,
        cijena: nova_pizza.cijena
    }

    pizze.splice(pizza_zamjena_index, 1, novi_zapis); */

    pizze.splice(pizza_zamjena_index, 1, {id: postojeci_id, ...nova_pizza})  // kraći zapis pomoću spread operatora

    return res.json(pizze);
});


// ruta koja pronalazi po id-u i ažurira cijenu

router.patch('/:id', (req, res) => {
    let id_pizze = req.params.id;

    if (isNaN(id_pizze)) {
        return res.status(400).json({greska: "ID pizze mora biti broj"});
    }
    
    if (!req.body) {
        return res.status(400).json({greska: "HTTP body je prazan!"});
    };

    // Provjera: postoji li u req.body barem 1 ključ koji je sadržan u dozvoljeni_kljucevi

    let patch_podaci = req.body;
    let patch_podaci_kljucevi = Object.keys(patch_podaci);

    if (!patch_podaci_kljucevi.every(kljuc => dozvoljeni_kljucevi.includes(kljuc))) {
        return res.status(400).json({greska: "Uneseni neispravni ključevi"});
    };

    let pizza_azuriranje_index = pizze.findIndex(pizza => pizza.id == id_pizze);

    if (pizza_azuriranje_index == -1) {
        return res.status(404).json({greska: `Pizza id ${id_pizze} ne postoji`})
    }

    let pizza_patch = pizze[pizza_azuriranje_index];

    /*
    patch_podaci_kljucevi.forEach(kljuc => {
        pizza_patch[kljuc] = patch_podaci[kljuc];
    })

    umjesto forEach petlje mozemo koristiti Object.assign*/

    Object.assign(pizza_patch, patch_podaci);  // (target, source)

    /* patch samo za cijenu

    let { cijena } = req.body;  // { cijena } ocitava cijenu ako je u bodyju, ako nije vraća grešku, mora pisati baš ključ iz objekta!!!!!!

    pizze[pizza_azuriranje_index].cijena = cijena;   */

    return res.status(200).json(pizze);
});


export default router;      // NE ZABORAVITI!!!!!!!!!!


// curl -X POST http://localhost:3000/naruci -H "Content-Type: application/json" -d '{"pizza": "Margherita", "velicina": "srednja"}'