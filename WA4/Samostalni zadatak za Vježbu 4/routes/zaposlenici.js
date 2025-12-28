import express from "express";
import fs from 'fs-extra';
import { checkArray, checkValue, sameArrays } from "../utils/index.js";

const router = express.Router();

let dozvoljeni_kljucevi = ["ime", "prezime", "godine_staža", "pozicija"];


router.get('/', async (req, res) => {
    let sortiraj_query = req.query.sortiraj_po_godinama;
    let pozicija_query = req.query.pozicija;
    let min_godine_query = req.query.godine_staža_min;
    let max_godine_query = req.query.godine_staža_max;


    try {
        const zaposlenici = await fs.readJson('data/zaposlenici.json');

        if (!checkArray(zaposlenici)) {
                return res.status(500).json({greska: "Podacima se ne može pristupiti."})
        }

        if (sortiraj_query) {
            if (sortiraj_query === 'uzlazno') {
                zaposlenici.sort((a, b) => a.godine_staža - b.godine_staža);
            } else if (sortiraj_query === 'silazno') {
                zaposlenici.sort((a, b) => b.godine_staža - a.godine_staža);
            }
        }

        if (!pozicija_query && !min_godine_query && !max_godine_query) {
            return res.status(200).send(zaposlenici);
        }

        // nisam htjela pisati filtriranje za svaku kombinaciju query parametara zasebno 
        // mislila sam si "ovo se sigurno da nekako elegantnije napisati"
        // pa sam umjesto toga SATIMA LUPALA GLAVOM U ZID dok nisam ovo smislila
        // cisto da napomenem :)))

        const filtrirani_zaposlenici = zaposlenici.filter(z => {
            if (pozicija_query && z.pozicija !== pozicija_query) return false;
            if (min_godine_query && z.godine_staža < parseInt(min_godine_query)) return false;
            if (max_godine_query && z.godine_staža > parseInt(max_godine_query)) return false;
            return true;
        })
        
        if (filtrirani_zaposlenici.length === 0) {
            return res.status(200).json({poruka: "Nema odgovarajućih zaposlenika!"})
        }
        return res.status(200).send(filtrirani_zaposlenici);

    } catch (error) {
        console.error('Greška prilikom čitanja datoteke:', error);
        res.status(500).send('Greška prilikom čitanja datoteke.');
    }
});



router.get('/:id', async (req, res) => {
    const zaposlenikId = req.params.id;

    if (isNaN(zaposlenikId)) {        
        return res.status(400).json({greska: "Niste poslali ispravan zaposlenikId parametar."})
    }

    try {
        const zaposlenici = await fs.readJson('data/zaposlenici.json');

        if (!checkArray(zaposlenici)) {
            return res.status(500).json({greska: "Podacima se ne može pristupiti."})
        }

        const zaposlenik = zaposlenici.find(z => z.id == zaposlenikId);

        if (!zaposlenik) {
            return res.status(404).json({poruka: "Traženi zaposlenik ne postoji"});
        }

        return res.status(200).json(zaposlenik);
    } catch (error) {
        console.error('Greška prilikom čitanja datoteke:', error);
        return res.status(500).send('Greška prilikom čitanja datoteke.');
    }
});



router.post('/', async (req, res) => {
    const zaposlenik = req.body;

    if (!req.body) {
        return res.status(400).json({greska: "Niste poslali podatke!"});
    };

    let kljucevi_zaposlenik= Object.keys(zaposlenik);
    
    if (!sameArrays(dozvoljeni_kljucevi, kljucevi_zaposlenik)) {
        return res.status(400).json({greska: "Ključevi se ne podudaraju."});
    }

    // sto se validacija tice, nisam bila sigurna sto sve treba pa sam dodala ovo ispod + helper funkciju da malo zakompliciram
    if (!checkValue(zaposlenik, kljucevi_zaposlenik)) {
        return res.status(400).json({greska: "Svi podaci o zaposleniku moraju biti upisani!"});
    }

    if (isNaN(zaposlenik.godine_staža)) {
        return res.status(400).json({greska: "Godine staža moraju biti broj!"});
    }

    if (typeof zaposlenik.ime !== "string" || typeof zaposlenik.prezime !== "string") {
        return res.status(400).json({greska: "Ime i prezime moraju biti string!"});
    }

    try {
        const zaposlenici = await fs.readJson('data/zaposlenici.json');
        const novi_id = zaposlenici.at(-1)['id'] + 1;
        zaposlenici.push({id: novi_id, ...zaposlenik});
        await fs.writeJson('data/zaposlenici.json', zaposlenici); 

        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(201).json({poruka: "Dodavanje zaposlenika uspješno!"});
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});


export default router;