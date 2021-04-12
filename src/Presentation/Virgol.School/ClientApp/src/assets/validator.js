const checkPersian = (value) => {
    return /^[پچجحخهعغآ؟.،آفقثصضشسیبلاتنمکگوئدذرزطظژ!!ؤإأءًٌٍَُِّ\s]+$/u.test(value)
}

const checkEnglish = (value) => {
    return /^[a-zA-Z\s]*$/.test(value);
}


const checkMelliCode = (value) => {
    if(!value)
        return false
        
    return true
    // if (!/^\d{10}$/.test(value))
    //     return false;

    // const check = +value[9];
    // const sum = Array(9).fill().map((_, i) => +value[i] * (10 - i)).reduce((x, y) => x + y) % 11;
    // return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
}

const checkPhoneNumber = (value) => {
    return /^(\+98|0098|98|0)?9\d{9}$/.test(value);
}

export const validator = {
    checkPersian,
    checkEnglish,
    checkMelliCode,
    checkPhoneNumber
}