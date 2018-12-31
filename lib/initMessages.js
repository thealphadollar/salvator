const os = require('os');
const genWish = require('./genWish');
const sendMessage = require('./sendMessage');


const THREE_GB = 3072 * 1024 * 1024;

/**
 * Initializes the message for a particular profile and calls
 * sendMessage() for that particular profile.
 *
 * @param {*} browser - puppeteer browser object
 * @param {*} newLinks - array of messenger links to which birthday msg is to be sent
 * @param {*} [firstNames=undefined] - array of first names of the above messenger profiles
 */
async function initMessages(
    browser,
    newLinks,
    firstNames = undefined
) {
    let to_await = false;
    if (os.totalmem() < THREE_GB) {
        to_await = true;
    }
    try {
        for (let i = 0; i < newLinks.length; i++) {
            let message;
            if (firstNames) {
                message = genWish(firstNames[i]);
            } else {
                message = genWish();
            }
            const page = await browser.newPage();
            to_await = true;
            if (to_await) {
                // console.log(newLinks[i]);
                await sendMessage(page, newLinks[i], message);
            } else {
                sendMessage(page, newLinks[i], message);
            }
        }
    } catch (e) {
        throw Error(e);
    }

}

module.exports = initMessages;