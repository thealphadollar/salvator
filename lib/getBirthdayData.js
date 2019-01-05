const Ora = require("ora");

const login = require("./login");
const parseRawBirthdayData = require('./parseRawBirthdayData');
const { resolveNames, resolveLinks } = require("./resolve_raw_data");

const LOGIN_URL = "https://www.fb.com/login";

/**
 * Gets an array of profile and messenger links as well as the names of 
 * people having their birthday today.
 *
 * @param {*} browser - puppeteer browser object
 * @param {*} fbID - facebook ID
 * @param {*} fbPass - facebook password
 * @returns
 */
async function getBirthdayData(browser, fbID, fbPass) {
    let links = {};
    let names = {};
    let page;
    try {
        page = await browser.newPage();
        let spinner = new Ora({
            text: 'Logging into fB'.green.bold,
            stream: process.stdout
        });

        spinner.start();
        await login(page, LOGIN_URL, fbID, fbPass, spinner);
        spinner.succeed();
        spinner = new Ora({
            text: 'Fetching Birthday Data'.green.bold,
            stream: process.stdout
        });
        spinner.start();
        const birthday_data = await parseRawBirthdayData(page, spinner);
        links = resolveLinks(birthday_data.raw_links);
        names = resolveNames(birthday_data.raw_names);
        page.waitFor(2000);
        spinner.succeed();
        return { links, names, page };
    } catch (e) {
        throw Error(e.message);
    }
}

module.exports = getBirthdayData;

