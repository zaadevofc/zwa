const char = {
    string: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    number: '0987654321',
    symbol: `!@#$%^&*()?/`
}

const string = (length = 30) => {
    var result = '';
    var characters = char.string
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const number = (length = 30) => {
    var result = '';
    var characters = char.number
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const hexColor = () => {
    const hex = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    return hex
}

const emoji = (cat, sub) => {
    const emojis = require('../utils/emoji')
    const random = (array) => array[~~(Math.random() * array.length)]

    if (!emojis[cat])
        cat = random(Object.keys(emojis))

    if (!emojis[cat][sub])
        sub = random(Object.keys(emojis[cat]))

    return random(emojis[cat][sub])
}

const id = (length = 8) => {
    return `#${number(length)}`
}

const otp = (length = 6) => {
    return number(length)
}

const password = (length = 15) => {
    var result = '';
    var characters = char.string + char.number
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const serialId = (length = 20, separator = 5) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        if ((i + 1) % separator === 0 && i !== length - 1) {
            result += '-';
        }
    }
    return result;
}

module.exports = { string, number, hexColor, emoji, id, otp, password, serialId }