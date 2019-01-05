/* eslint-disable no-param-reassign */

/**
 * logins into your fb account using env variables
 *
 * @param {*} page - puppeteer page object
 * @param {*} LOGIN_URL - fabook login page URL
 * @param {*} fbID - account fb id
 * @param {*} fbPass - account fb password
 * @param {*} spinner - ora cli spinner
 * @returns true if login was successful else results into an error
 */
async function login(page, LOGIN_URL, fbID, fbPass, spinner) {
    try {
        spinner.text = 'Logging into fB - opening puppeteer page'.green.bold;
        try {
            await page.goto(LOGIN_URL);
        } catch (e) {
            throw new Error("Check your internet connection!");
        }
        spinner.text = 'Logging into fB - login URL opened'.green.bold;
        await page.type("#email", fbID);
        await page.type("#pass", fbPass);
        await page.waitFor(1000);
        spinner.text = 'Logging into fB - entries filled'.green.bold;
        await page.click("#loginbutton");
        await page.waitFor(10000);
        if (page.url() !== 'https://www.facebook.com/')
            throw new Error("Login Failed! Check your Login credentials");
        spinner.text = 'Logging into fB - successfully logged in'.green.bold;
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = login;