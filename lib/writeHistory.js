const fs = require('fs');
const path = require('path');
const process = require('process');

const PATH_TO_DATA = path.resolve(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], 'salvator', 'data.json');

/**
 * Writes the links to data.json for which the birthday messages were sent
 *
 * @param {*} sendLinks - Links to which birthday messages were sent
 * @param {*} spinner - ora cli spinner
 */
async function writeHistory(sendLinks, spinner) {
    const d = new Date();
    const list = [];
    for (let i = 0; i < sendLinks.length; i++) {
        list.push(sendLinks[i]);
    }
    const obj = {};
    obj.date = d;
    obj.links = list;

    const content = JSON.stringify(obj);
    try {
        if (!fs.existsSync(PATH_TO_DATA)){
            fs.mkdirSync(path.dirname(PATH_TO_DATA))
        }
        fs.writeFile(PATH_TO_DATA, content, "utf8", (err) => {
            if (err) throw err;
            spinner.text = 'Updating sent history - file was saved!'.green.bold;
        });
    } catch (e) {
        throw new Error("Error while writing to data.json");
    }

}

module.exports = writeHistory;