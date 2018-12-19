/**
 * Sends birthday message to a particular profile through
 * messenger.
 *
 * @param {*} page - puppeteer page object
 * @param {*} link - messenger link of a profile
 * @param {*} message - birthday message to be send
 */
async function sendMessage(page, link, message) {
    await page.goto(link, { waitUntil: "networkidle2" });
    await page.keyboard.type(message);
    await page.keyboard.press("Enter");
    await page.waitFor(1000);
    await page.close();
}

module.exports = sendMessage;