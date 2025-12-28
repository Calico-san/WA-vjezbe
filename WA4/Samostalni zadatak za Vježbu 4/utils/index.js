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

    return array_1.every(element => array_2.includes(element));   
}

export function checkValue(body, kljucevi) {
    for (const kljuc of kljucevi) {
        if (body[kljuc] === null || body[kljuc] === undefined) {
            return false;
        }

        if (typeof body[kljuc] === "string" && body[kljuc].trim() === "") {
            return false;
        }
    }

    return true;
}
