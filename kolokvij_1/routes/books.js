import express from "express";
import { books } from "../data/books.js";

const router = express.Router();

let dozvoljeni_kljucevi = ["naslov", "autor", "godina_izdanja", "kategorije"];
let dopustene_kategorije = ["Programming", "Software Engineering", "Best Practices", "Architecture", "Databases", "Networking"];

router.get('/', (req, res) => {
    res.status(200).json(books);
})

router.get('/:naslov', (req, res) => {
    let naslov_knjige = req.params.naslov;

    let knjiga = books.find(book => book.naslov == naslov_knjige);

    if (!knjiga) {
        return res.status(404).json({greska: `Knjiga s naslovom ${naslov_knjige} ne postoji!`});
    }
    return res.status(200).json(knjiga);
})

router.post('/', (req, res) => {
    let nova_knjiga = req.body;

    let exists = books.find(book => book.naslov == nova_knjiga.naslov);

    if (exists) {
        return res.status(400).json({greska: `Knjiga s naslovom ${nova_knjiga.naslov} već postoji!`});
    }

    if (nova_knjiga.godina_izdanja > 2025) {
        return res.status(400).json({greska: "Godina izdanja ne može biti u budućnosti"});
    }

    let kljucevi_nova_knjiga = Object.keys(nova_knjiga);

    if (dozvoljeni_kljucevi.length != kljucevi_nova_knjiga.length || !kljucevi_nova_knjiga.every(kljuc => dozvoljeni_kljucevi.includes(kljuc))) {
        return res.status(400).json({greska: "Ključevi se ne podudaraju"});
    }

    if (!nova_knjiga.kategorije.every(kat => dopustene_kategorije.includes(kat))) {
        return res.status(400).json({greska: "Unesena je nedopuštena kategorija"});
    }

    let id_knjige = books.at(-1)['id'] + 1;

    books.push({id: id_knjige, ...nova_knjiga});
    return res.status(201).json(books);
})

router.put('/:id', (req, res) => {
    let id_knjige = req.params.id;

    let knjiga_za_izmjenu = books.find(book => book.id == id_knjige);

    if (!knjiga_za_izmjenu) {
        return res.status(404).json({greska: `Knjiga s id ${id_knjige} ne postoji`});
    }

    let izmjena_knjige = req.body;

    if(isNaN(izmjena_knjige.godina_izdanja)) {
        return res.status(400).json({greska: "Godina izdanja mora biti broj"});
    }

    if (izmjena_knjige.godina_izdanja > 2025 || izmjena_knjige.godina_izdanja == knjiga_za_izmjenu.godina_izdanja) {
        return res.status(400).json({greska: "Unesena pogrešna godina izdanja"});
    }

    knjiga_za_izmjenu.godina_izdanja = izmjena_knjige.godina_izdanja;
    return res.status(201).json(books);
})

export default router;