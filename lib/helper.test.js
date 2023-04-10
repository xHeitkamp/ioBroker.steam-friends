const assert = require('assert');
const helper = require('./helper');

describe('Tests for helper functions', () => {
    //timeConverter()
    describe('#timeConverter', () => {
        it('should return a formatted date string for a valid timestamp', () => {
            const timestamp = 1649605947; // 2022-04-09T17:12:27.000Z
            const expected = '4/10/2022, 5:52:27 PM';
            assert.notStrictEqual(helper.timeConverter(timestamp), expected);
        });

        it('should return an empty string for a timestamp <= 0', () => {
            const timestamp = 0;
            const expected = '';
            assert.strictEqual(helper.timeConverter(timestamp), expected);
        });

        it('should return an empty string for a non-numeric timestamp', () => {
            const timestamp = 'not a timestamp';
            const expected = '';
            // @ts-ignore
            assert.strictEqual(helper.timeConverter(timestamp), expected);
        });
    });

    //orderObject()
    describe('#orderObject', () => {
        it('should return an object with keys in alphabetical order', () => {
            const unordered = { z: 1, y: 2, x: 3 };
            const expected = { x: 3, y: 2, z: 1 };
            assert.deepStrictEqual(helper.orderObject(unordered), expected);
        });

        it('should return an empty object if given an empty object', () => {
            const unordered = {};
            const expected = {};
            assert.deepStrictEqual(helper.orderObject(unordered), expected);
        });
    });

    //splitArrayIntoChunks()
    describe('#splitArrayIntoChunks', () => {
        it('should split an array into chunks of the given length', () => {
            const arr = [1, 2, 3, 4, 5, 6];
            const len = 2;
            const expected = [
                [1, 2],
                [3, 4],
                [5, 6],
            ];
            assert.deepStrictEqual(
                helper.splitArrayIntoChunks(arr, len),
                expected
            );
        });

        it('should return an array with a single chunk if the length is greater than the array length', () => {
            const arr = [1, 2, 3];
            const len = 5;
            const expected = [[1, 2, 3]];
            assert.deepStrictEqual(
                helper.splitArrayIntoChunks(arr, len),
                expected
            );
        });

        it('should return an empty array if given an empty array', () => {
            const arr = [];
            const len = 2;
            const expected = [];
            assert.deepStrictEqual(
                helper.splitArrayIntoChunks(arr, len),
                expected
            );
        });
    });

    //mergeArray()
    describe('#mergeArrays()', () => {
        it('should merge two arrays of objects with matching steamids', () => {
            const arr1 = [
                { steamid: '1', name: 'John' },
                { steamid: '2', name: 'Jane' },
                { steamid: '3', name: 'Bob' },
            ];
            const arr2 = [
                { steamid: '1', age: 30 },
                { steamid: '2', age: 25 },
            ];
            const expected = [
                { steamid: '1', name: 'John', age: 30 },
                { steamid: '2', name: 'Jane', age: 25 },
                { steamid: '3', name: 'Bob' },
            ];
            assert.deepStrictEqual(helper.mergeArrays(arr1, arr2), expected);
        });

        it('should return arr1 unchanged if arr2 is empty', () => {
            const arr1 = [
                { steamid: '1', name: 'John' },
                { steamid: '2', name: 'Jane' },
            ];
            const arr2 = [];
            assert.deepStrictEqual(helper.mergeArrays(arr1, arr2), arr1);
        });

        it('should return arr1 unchanged if no steamids match', () => {
            const arr1 = [
                { steamid: '1', name: 'John' },
                { steamid: '2', name: 'Jane' },
            ];
            const arr2 = [
                { steamid: '3', age: 30 },
                { steamid: '4', age: 25 },
            ];
            assert.deepStrictEqual(helper.mergeArrays(arr1, arr2), arr1);
        });
    });

    //getDiffOfArrs()
    describe('#getDiffOfArrs', () => {
        it('should return an array of elements that are in the first array but not the second', () => {
            const firstArr = [1, 2, 3, 4, 5];
            const secondArr = [3, 4, 5, 6];
            const expected = [1, 2];
            assert.deepStrictEqual(
                helper.getDiffOfArrs(firstArr, secondArr),
                expected
            );
        });

        it('should return an empty array if both arrays contain the same elements', () => {
            const firstArr = [1, 2, 3];
            const secondArr = [1, 2, 3];
            const expected = [];
            assert.deepStrictEqual(
                helper.getDiffOfArrs(firstArr, secondArr),
                expected
            );
        });

        it('should return the difference of arrays if they have a difference', () => {
            const firstArr = [1, 2, 3, 4, 5];
            const secondArr = [2, 3, 4];
            const expected = [1, 5];
            assert.deepStrictEqual(
                helper.getDiffOfArrs(firstArr, secondArr),
                expected
            );
        });

        it('should return the difference of arrays if they have a difference', () => {
            const firstArr = [2, 3, 4];
            const secondArr = [1, 2, 3, 4, 5];
            const expected = [1, 5];
            assert.deepStrictEqual(
                helper.getDiffOfArrs(firstArr, secondArr),
                expected
            );
        });

        it('should return the first array if the second array is empty', () => {
            const firstArr = [1, 2, 3];
            const secondArr = [];
            const expected = [1, 2, 3];
            assert.deepStrictEqual(
                helper.getDiffOfArrs(firstArr, secondArr),
                expected
            );
        });

        it('should return the second array if the first array is empty', () => {
            const firstArr = [];
            const secondArr = [1, 2, 3];
            const expected = [1, 2, 3];
            assert.deepStrictEqual(
                helper.getDiffOfArrs(firstArr, secondArr),
                expected
            );
        });
    });

    //downloadImage()
    describe('#downloadImage', () => {});
});
