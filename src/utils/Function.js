const chalk = require("chalk");
const moment = require("moment/moment");

exports.checkKey = (str, obj) => {
    const jstr = JSON.stringify(obj);
    const result = jstr.includes(str);
    return result;
}

exports.getValue = (key, obj) => {
    let result = [];
    const search = (key, obj) => {
        if (typeof obj !== 'object' || obj === null) return;
        if (key in obj) {
            result.push(obj[key]);
        }
        for (let prop in obj) {
            search(key, obj[prop]);
        }
    };
    search(key, obj);
    return [...new Set(result.filter((item) => item ? item.length != 0 : item))];
};

const removeKey = (propertyName, obj) => {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                removeKey(propertyName, item);
            });
        } else {
            Object.keys(obj).forEach(function (key) {
                if (key === propertyName) {
                    obj = Object.assign({}, obj);
                    delete obj[key];
                } else {
                    obj[key] = removeKey(propertyName, obj[key]);
                }
            });
        }
    }
    return obj;
}

exports.removeKey = removeKey
exports.getMatchKeyByArray = (obj, arr) => {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        if (arr.includes(keys[i])) {
            return keys[i];
        }
        if (typeof obj[keys[i]] === "object") {
            const subKey = this.getMatchKeyByArray(obj[keys[i]], arr);
            if (subKey) {
                return subKey;
            }
        }
    }
    return null;
}


exports.checkArrayInArray = (array1, array2) => array1.some(item => array2.includes(item));
exports.getValueByArray = (array1, array2) => array1.filter(item => array2.includes(item))[0]
exports.getAllValuesByKey = (key, obj, index = null) => {
    let count = 0;
    let values = [];
    const traverseObject = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
            if (key in obj) {
                if (index === null || count === index) {
                    values.push(obj[key]);
                }
                count++;
            }
            for (let k in obj) {
                traverseObject(obj[k]);
            }
        }
    }
    traverseObject(obj);
    return [...new Set(values)];
}

exports.color = (text = [], color = []) => {
    let res = []

    for (let i = 0; i < text.length; i++) {
        const x = text[i];
        res.push(chalk.keyword(color[i])(x))
    }

    return res.join(' ')
}

exports.parseMention = (text) => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map((v) => v[1] + '@s.whatsapp.net');
exports.getTime = (t, format = 'DD/MM/YY HH:mm:ss') => moment(t).format(format)