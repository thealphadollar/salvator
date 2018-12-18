/* eslint-disable no-continue */

const path = require("path");
const pup = require("puppeteer");

const login = require('./login');
const email = require("./email_notification");
const initMessages = require('./initMessages');
const checkHistory = require('./checkHistory');
const writeHistory = require('./writeHistory');
const getRawBirthdayData = require('./getRawBirthdayData');
const { resolveNames, resolveLinks } = require("./resolve_raw_data");

const PATH_TO_DOTENV = path.resolve(__dirname, "../.env");
require("dotenv").config({
    path: PATH_TO_DOTENV
});


const LOGIN_URL = "https://www.fb.com/login";
const fbID = process.env.FB_ID;
const fbPass = process.env.FB_PASS;



/**
 * The main function where the execution of script starts
 *
 * @returns
 */
async function main() {
    const browser = await pup.launch({
        // headless: false,
        args: ["--no-sandbox", "--disable-notifications"]
    });
    const page = await browser.newPage();

    console.log("trying to login...");
    await login(page, LOGIN_URL, fbID, fbPass);
    console.log("successfully logged in");
    await page.waitFor(10000);

    console.log("getting birthdays...");
    const birthday_data = await getRawBirthdayData(page);
    page.close();
    console.log("links received");

    console.log("extracting details from received raw data...");
    const links = resolveLinks(birthday_data.raw_links);
    const names = resolveNames(birthday_data.raw_names);
    // console.log(links.messageLinks);
    console.log("data fetched");

    console.log("Checking write history");
    const prevLinks = await checkHistory();
    // remove those links from links.messageLinks already present in prevLinks and names as well
    const newLinks = links.messageLinks.filter((link, i) => {
        if (prevLinks.find(plink => plink === link) === undefined) // when not found, returns true
            return true;
        names.firstNames.splice(i, 1);
        names.fullNames.splice(i, 1);
        return false;
    });

    if (newLinks.length === 0) {
        console.log("No Birthdays found. Exiting in 3 seconds...");
        await page.waitFor(3000);
        await browser.close();
        return;
    }
    if (newLinks.length === names.firstNames.length) {
        console.log("sending messages with names");
        await initMessages(
            browser,
            newLinks,
            names.firstNames
        );
    } else {
        console.log("sending messages without name, length mismatch!");
        await initMessages(browser, newLinks);
    }

    await page.waitFor(10000);
    console.log("messages sent...");
    await writeHistory(newLinks.concat(prevLinks));
    email.notifyMe(newLinks, names.fullNames);
    console.log("sending mail notification...");
    await browser.close();
}

module.exports = { main };
