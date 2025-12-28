import express from "express";
import path from 'path';

const app = express(); 
const PORT = 3000;

app.use(express.json());  

app.listen(PORT, error => {
    if (error) {
        console.error('Greška pri pokretanju poslužitelja');
    }
    console.log(`Poslužitelj sluša na portu ${PORT}`);
});

app.get('/', (req, res) => {
    res.status(200).send('Vrijeme je za čitanje datoteka!');
});


// relativna putanja do datoteke 'story.txt'
fs.readFile('./data/story.txt', 'utf8', (err, data) => {
    // čitanje datoteke 'story.txt' u utf8 formatu
    if (err) {
        // ako se dogodila greška
        console.error('Greška prilikom čitanja datoteke:', err); // ispisuje grešku
        return;
    }

    console.log('Sadržaj datoteke:', data); // ispisuje sadržaj datoteke
});


/* apsolutna putanja do datoteke 'story.txt'

fs.readFile('D:\\Sync\\FIPU\\3. godina\\Web aplikacije\\WA-vjezbe\\WA4\\app\\data\\story.txt', 'utf8', (err, data) => {
    // čitanje datoteke 'story.txt' u utf8 formatu
    if (err) {
        // ako se dogodila greška
        console.error('Greška prilikom čitanja datoteke:', err); // ispisuje grešku
        return;
    }

    console.log('Sadržaj datoteke:', data); // ispisuje sadržaj datoteke
}); 

Vidimo da smo u kôdu koristili dvostruke kose crte ( \\ ) kao separator direktorija. Ovo je
specifično za Windows sustave budući da jedna kosa crta ( \ ) predstavlja escape znak u JavaScriptu. Kako
bismo izbjegli ovu konflikt, koristimo dvostruke kose crte. Primjer, escape znak za novi red je \n pa samim
tim \\ predstavlja jednu kosa crtu unutar stringa.

*/






// Apsolutna putanja do datoteke






/* console.log(import.meta.url);  // vraca apsolutnu putanju tj. URL string do trenutnog modula (index.js)
// Ispisuje: file:///D:/Sync/FIPU/3.%20godina/Web%20aplikacije/WA-vjezbe/WA4/app/index.js


const currentDir = path.dirname(import.meta.url);  // path.dirname() vraca apsolutnu putanju tj. URL string do direktorija gdje je trenutni modul (index.js)
console.log(currentDir); 
// Ispisuje: file:///D:/Sync/FIPU/3.%20godina/Web%20aplikacije/WA-vjezbe/WA4/app


// Pretvorbu file: URL-a u čisti string putanju možemo napraviti pomoću fileURLToPath funkcije iz url modula:
import { fileURLToPath } from 'url';

const currentDirPath = fileURLToPath(currentDir);
console.log(currentDirPath);
// Ispisuje: D:\Sync\FIPU\3. godina\Web aplikacije\WA-vjezbe\WA4\app


// Ovo sada možemo upotrijebiti za generiranje apsolutne putanje do datoteke story.txt na sljedeći način:

const storyPath = path.join(currentDirPath, 'data', 'story.txt');
console.log(storyPath);
// Ispisuje: D:\Sync\FIPU\3. godina\Web aplikacije\WA-vjezbe\WA4\app\data\story.txt     */







// najjednostavnije koristiti path.resolve() koji vraca apsolutnu putanju do trenutnog radnog direktorija

console.log(path.resolve());
// Ispisuje: D:\Sync\FIPU\3. godina\Web aplikacije\WA-vjezbe\WA4\app

// ako niti jedan argument u path.resolve nema / onda se koristi apsolutna putanja do trenutnog radnog direktorija i na nju dodaju argumenti:

const putanja = path.resolve('data', 'story.txt');
console.log(putanja);
// Ispisuje: D:\Sync\FIPU\3. godina\Web aplikacije\WA-vjezbe\WA4\app\data\story.txt

const put = path.resolve('/data','story.txt');
console.log(put);
// Ispisuje: D:\data\story.txt

const parentDir = path.resolve('..'); // apsolutna putanja do roditeljskog direktorija (u odnosu na trenutni radni direktorij)
console.log(parentDir);
// Ispisuje: D:\Sync\FIPU\3. godina\Web aplikacije\WA-vjezbe\WA4




// import fs from 'fs/promises';

async function read_story() {
  try {
    const data = await fs.readFile('data/story.txt', 'utf8'); // await budući da je fs.readFile asinkrona funkcija
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

app.get('/story', async (req, res) => {
    const data = await read_story(); // await budući da je read_story također asinkrona funkcija
    if (data) {
        res.status(200).send(data);
    } else {
        res.status(500).send('Error reading story file.');
    }
});


async function write_data(data) {
    try {
        await fs.writeFile('data/write.txt', data, 'utf8');
        console.log('Podaci uspješno zapisani u datoteku.');
        return true;
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        return false;
    }
}

app.get('/write', async (req, res) => {
    const data = 'Ovo je tekst koji želimo zapisati u datoteku.';
    const success = await write_data(data);
    if (success) {
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } else {
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});



/*

import fs from 'fs';

app.get('/write-callback', (req, res) => {
    const string = 'Ovo je tekst koji smo pohranili asinkrono u datoteku kroz Callback pattern i w flag.';
    // flag je `w`, dakle svaki put ćemo zamijeniti sadržaj datoteke
    fs.writeFile('data/text.txt', string, { encoding: 'utf8', flag: 'w' }, err => {
        if (err) {
            console.error('Greška prilikom pohrane u datoteku:', err);
            res.status(500).send('Greška prilikom pohrane u datoteku.');
        } else {
            console.log('Podaci uspješno zapisani u datoteku.');
            res.status(200).send('Podaci uspješno zapisani u datoteku.');
        }
    });
});

*/


app.get('/append-promise', async (req, res) => {
  const string = 'Ovo je tekst koji smo pohranili asinkrono u datoteku kroz Promise pattern i a flag.';
  // flag je `a`, dakle svakim pozivom ćemo dodati sadržaj na kraj datoteke
  try {
    await fs.writeFile('data/text.txt', string, { encoding: 'utf8', flag: 'a' });
    console.log('Podaci uspješno zapisani u datoteku.');
    res.status(200).send('Podaci uspješno zapisani u datoteku.');
  } catch (error) {
    console.error('Greška prilikom pohrane u datoteku:', error);
    res.status(500).send('Greška prilikom pohrane u datoteku.');
  }
});

let student_pero = {
    ime: 'Pero',
    prezime: 'Perić',
    godine: 20,
    fakultet: 'FIPU'
};


app.post('/student', async (req, res) => {
    const student = req.body;

    if (Object.keys(student).length === 0) {
        return res.status(400).send('Niste poslali podatke.');
    }

    try {
        await fs.writeFile('data/data.json', JSON.stringify(student));
        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});


/* bez modula fs-extra

app.put('/student', async (req, res) => {
    const student = req.body;

    if (Object.keys(student).length === 0) {
        return res.status(400).send('Niste poslali podatke.');
    }

    try {
        // pročitaj datoteku
        const data = await fs.readFile('data/data.json', 'utf8');
        // deserijaliziraj JSON podatke
        const students = JSON.parse(data);
        // dodaj novog studenta
        students.push(student);
        // serijaliziraj i pohrani
        await fs.writeFile('data/data.json', JSON.stringify(students));
        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});   

*/



// s modulom fs-extra

// import fs from 'fs-extra';

app.put('/student', async (req, res) => {
    const student = req.body;

    if (Object.keys(student).length === 0) {
        return res.status(400).send('Niste poslali podatke.');
    }

    try {
        // pročitaj datoteku, deserijaliziraj JSON podatke i pohrani u varijablu
        const students = await fs.readJson('data/data.json');
        students.push(student);
        await fs.writeJson('data/data.json', students); // serijaliziraj i pohrani u datoteku

        console.log('Podaci uspješno zapisani u datoteku.');
        res.status(200).send('Podaci uspješno zapisani u datoteku.');
    } catch (error) {
        console.error('Greška prilikom pohrane u datoteku:', error);
        res.status(500).send('Greška prilikom pohrane u datoteku.');
    }
});







import fs from 'fs/promises';


/* FILTRIRANJE

app.get('/students', async (req, res) => {
    let fakultet_query = req.query.fakultet;
    let godine_query = req.query.godine;

    try {
        const data = await fs.readFile('data/students.json', 'utf8');
        const students = JSON.parse(data);
        // slučaj 1: oba query parametra su prisutna
        if (fakultet_query && godine_query) {
            const filtered_students = students.filter(student => student.fakultet === fakultet_query && student.godine === parseInt(godine_query));
            return res.status(200).send(filtered_students);
            // slučaj 2: prisutan je samo fakultet query parametar
        } else if (fakultet_query) {
            const filtered_students = students.filter(student => student.fakultet === fakultet_query);
            return res.status(200).send(filtered_students);
            // slučaj 3: prisutan je samo godine query parametar
        } else if (godine_query) {
            const filtered_students = students.filter(student => student.godine === parseInt(godine_query));
            return res.status(200).send(filtered_students);
            // slučaj 4: nema query parametara
        } else {
            return res.status(200).send(students);
        }
    } catch (error) {
        console.error('Greška prilikom čitanja datoteke:', error);
        res.status(500).send('Greška prilikom čitanja datoteke.');
    }
});

*/





// SORTIRANJE

app.get('/students', async (req, res) => {
    let sortiraj_po_godinama = req.query.sortiraj_po_godinama; // dohvatimo vrijednost query parametar 'sortiraj_po_godinama'
    try {
        const data = await fs.readFile('data/students.json', 'utf8');
        const students = JSON.parse(data);
        // ako je prisutan query parametar 'sortiraj_po_godinama', sortiraj studente
        if (sortiraj_po_godinama) {
            if (sortiraj_po_godinama === 'uzlazno') {
                // sortiranje uzlazno: od najmanjeg prema najvećem
                students.sort((a, b) => a.godine - b.godine);
                // sortiranje silazno: od najvećeg prema najmanjem
            } else if (sortiraj_po_godinama === 'silazno') {
                students.sort((a, b) => b.godine - a.godine);
            }
        }

        res.status(200).send(students);
    } catch (error) {
        console.error('Greška prilikom čitanja datoteke:', error);
        res.status(500).send('Greška prilikom čitanja datoteke.');
    }
});