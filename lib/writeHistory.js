const fs = require('fs');
const path = require('path');

const PATH_TO_DATA = path.resolve(__dirname, "../data.json");

/**
 * Writes the links to data.json for which the birthday messages were sent
 *
 * @param {*} sendLinks - Links to which birthday messages were sent
 */
async function writeHistory(sendLinks) {
    const d = new Date();
    const list = [];
    for (let i = 0; i < sendLinks.length; i++) {
        list.push(sendLinks[i]);
    }
    const obj = {};
    obj.date = d;
    obj.links = list;

    const content = JSON.stringify(obj);

    fs.writeFile(PATH_TO_DATA, content, "utf8", (err) => {
        if (err) throw err;
        console.log("The file was saved!");
    });
}

module.exports = writeHistory;