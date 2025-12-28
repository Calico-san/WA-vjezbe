import express from "express";
import path from "path";

import { reviews } from "./data/reviews.js";
import { books } from "./data/books.js";

import books_router from "./routes/books.js";
import reviews_router from "./routes/reviews.js"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/books', books_router);
app.use('/reviews', reviews_router);

app.listen(PORT, error => {
    if (error) {
        console.error("Greška pri pokretanju poslužitelja");
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
})

app.get('/', (req, res) => {
    let putanja = path.resolve("views", "index.html");
    res.status(200).sendFile(putanja);
})



