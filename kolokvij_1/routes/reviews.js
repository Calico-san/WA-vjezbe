import express from "express";
import { reviews } from "../data/reviews.js";
import { books } from "../data/books.js";

const router = express.Router();


router.post('/', (req, res) => {
    let nova_recenzija = req.body;

    let exists = reviews.find(review => review.book_id == nova_recenzija.book_id);

    if (!exists) {
        return res.status(404).json({greska: `Knjiga s id ${nova_recenzija.book_id} ne postoji!`});
    }

    if (nova_recenzija.ocjena < 1 || nova_recenzija.ocjena > 10) {
        return res.status(400).json({greska: "Unesena neispravna ocjena"});
    }

    let id_recenzije = reviews.at(-1)['id'] + 1;

    reviews.push({id: id_recenzije, ...nova_recenzija});
    return res.status(201).json(reviews);
})

router.get('/:naslov', (req, res) => {
    let naslov_knjige = req.params.naslov;

    let book = books.find(book => book.naslov == naslov_knjige);

    if (!book) {
        return res.status(404).json({greska: `Knjiga s naslovom ${naslov_knjige} ne postoji!`});
    }

    let recenzija = reviews.find(review => review.book_id == book.id);

    if (!recenzija) {
        return res.status(404).json({greska: `Knjiga s naslovom ${naslov_knjige} nema recenzija!`});
    }
    return res.status(200).json({ocjena: recenzija.ocjena, recenzija: recenzija.komentar});
})

export default router;