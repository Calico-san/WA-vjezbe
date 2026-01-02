import express from "express";
import pizzeRouter from "./routes/pizze.js";
import narudzbeRouter from "./routes/narudzbe.js";
import cors from "cors";

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/pizze", pizzeRouter); // dodavanje prefiksa "/pizze" za svaki endpoint iz pizze.js Routera
app.use("/narudzbe", narudzbeRouter); // dodavanje prefiksa "/narudzbe" za svaki endpoint iz narudzbe.js Routera

app.listen(PORT, (error) => {
  if (error) {
    console.error("Greška pri pokretanju poslužitelja");
  }
  console.log(`Poslužitelj sluša na portu ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Dobrodošli u Pizza Express poslužitelj!");
});
