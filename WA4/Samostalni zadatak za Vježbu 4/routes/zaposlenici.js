import express from "express";
import fs from 'fs-extra';
import { checkArray, sameArrays } from "../utils/index.js";

const router = express.Router();

let dozvoljeni_kljucevi = ["ime", "prezime", "godine_staža", "pozicija"];


router.get('/', async (req, res) => {
    try {
        const zaposlenici = await fs.readJson('data/zaposlenici.json');

        if (!checkArray(zaposlenici)) {
                return res.status(500).json({greska: "Podacima se ne može pristupiti."})
        }

        return res.status(200).send(zaposlenici);
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

    try {
        const zaposlenici = await fs.readJson('data/zaposlenici.json');
        const novi_id = zaposlenici.at(-1)['id'] + 1;
        zaposlenici.push({id: novi_id, ...zaposlenik});
        await fs.writeJson('data/zaposlenici.json', zaposlenici); 

        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});


export default router;