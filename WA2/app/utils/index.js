import { pizze } from "../data/pizze_data.js";

export function checkArray(array) {
    return Array.isArray(array) && array.length != 0;
}

export function sameArrays(array_1, array_2) {
    if (!checkArray(array_1) || !checkArray(array_2)) {
        return false;
    }
 
    if (array_1.length != array_2.length) {
        return false;
    }

    return array_1.every(element => array_2.includes(element));   // every provjerava logički uvjet za svaki element polja  -- vraća true ako je svaki element zadovoljio uvjet
}


// helper funkcija koja provjerava postoji li pizza u "bazi"

export function pizzaExists(id_pizze) {
    return Boolean(pizze.find(pizza => pizza.id == id_pizze));
}