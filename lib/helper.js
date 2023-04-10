const axios = require('axios');

/**
 * Converts unix timestamp to '16 Aug 2018 20:39:09'
 * @function
 * @name timeConverter
 * @param {Number} timestamp
 * @returns {String}
 */
const timeConverter = (timestamp) => {
    if (isNaN(timestamp) || timestamp <= 0) {
        return '';
    }
    const time = new Date(timestamp * 1000);
    return time.toLocaleString();
};

/**
 * Sort keys of object
 * @function
 * @name orderObject
 * @param {Object} unordered
 * @returns {Object}
 */
const orderObject = (unordered) => {
    const ordered = Object.keys(unordered)
        .sort()
        .reduce((obj, key) => {
            obj[key] = unordered[key];
            return obj;
        }, {});
    // @ts-ignore
    return ordered;
};

/**
 * Split array into chunks
 * @function
 * @name splitArrayIntoChunks
 * @param {Array} arr
 * @param {Number} len
 * @returns {Array}
 */
const splitArrayIntoChunks = (arr, len) => {
    const chunks = [];
    const n = arr.length;
    let i = 0;
    while (i < n) chunks.push(arr.slice(i, (i += len)));
    return chunks;
};

/**
 * Merge 2 arrays with key
 * @function
 * @name mergeArrays
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Array}
 */
const mergeArrays = (arr1, arr2) => {
    const merged = arr1.map((item) => {
        arr2.forEach((item2) => {
            if (item.steamid === item2.steamid) item = Object.assign(item, item2);
        });
        return item;
    });
    return merged;
};

/**
 * Returns difference between 2 arrays
 * @function
 * @name getDiffOfArrs
 * @param {Array} firstArr
 * @param {Array} secondArr
 * @returns {Array}
 */
const getDiffOfArrs = (firstArr, secondArr) => {
    const bigArr = firstArr.length >= secondArr.length ? firstArr : secondArr;
    const smallArr = firstArr.length < secondArr.length ? firstArr : secondArr;
    return bigArr.filter((x) => !smallArr.includes(x));
};

/**
 * Convert image from url to base64
 * @function
 * @name mergeArrays
 * @param {String} imageUrl
 * @returns {Promise<String>}
 */
const downloadImage = async (imageUrl) => {
    // @ts-ignore
    const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'arraybuffer'
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpg;base64,${base64Image}`;
};

module.exports = { timeConverter, orderObject, splitArrayIntoChunks, mergeArrays, getDiffOfArrs, downloadImage };