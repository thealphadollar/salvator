const fs = require('fs');
const path = require('path');
const process = require('process');

const PATH_TO_DATA = path.resolve(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], 'salvator', 'data.json');

/**
 * Reads data.json to get messenger links to which birthday message 
 * has already been sent and compares with the current data
 * 
 * @param {*} spinner - ora cli spinner
 *
 * @returns a list of messenger links to which birthday message has already been sent
 */
async function checkHistory(spinner) {
    const array = [];
    const d1 = new Date();
    let obj;

    try {
        const data = fs.readFileSync(PATH_TO_DATA, "utf8");
        obj = JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            spinner.text = `Checking if Birthday wish was sent before - data.json doesn't exist`.green.bold;
            return [];
        }
        throw new Error(err.message);
    }

    const d2 = new Date(obj.date);
    const flag =
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    if (flag === false) return array;
    for (let i = 0; i < obj.links.length; i++) array[i] = obj.links[i];

    // console.log("previous links array generated successfully");
    return array;
}

module.exports = checkHistory;