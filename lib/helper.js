// Converts unix timestamp to '16 Aug 2018 20:39:09'
/**
 * @function
 * @name timeConverter
 * @param {Number} timestamp 
 * @returns {String}
 */
const timeConverter = (timestamp) => {
	const time = new Date(timestamp * 1000);
	return time.toLocaleString();
};

// Sort keys of object
/**
* @function
* @name orderObject
* @param {Array} unordered 
* @returns {Array}
*/
const orderObject = (unordered) => {
	const ordered = Object.keys(unordered)
		.sort()
		.reduce((obj, key) => {
			obj[key] = unordered[key];
			return obj;
		}, {});
	return ordered;
};

// Split arrays into chunks
/**
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

// Merge 2 arrays with key
/**
 * @function
 * @name mergeArrays
 * @param {Array} arr1
 * @param {Array} arr2 
 * @returns {Array}
 */
const mergeArrays = (arr1, arr2) => {
	let merged = arr1.map((item, index) => {
		arr2.forEach((item2) => {
			if (item.steamid === item2.steamid) item = Object.assign(item, item2);
		});
		return item;
	});
	return merged;
};

module.exports = { timeConverter, orderObject, splitArrayIntoChunks, mergeArrays };
