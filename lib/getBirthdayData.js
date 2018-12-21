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
        await login(page, LOGIN_URL, fbID, fbPass);

        const birthday_data = await parseRawBirthdayData(page);
        console.log("extracting details from received raw data...");
        links = resolveLinks(birthday_data.raw_links);
        names = resolveNames(birthday_data.raw_names);
        page.waitFor(2000);
        console.log("data fetched");

    } catch (e) { }
    return { links, names, page };
}

module.exports = getBirthdayData;

