/* eslint-disable no-continue */
const Ora = require("ora");
const path = require("path");
const pup = require("puppeteer");
const logSymbols = require("log-symbols");
require('colors');

const login = require('./login');
const email = require("./email_notification");
const initMessages = require('./initMessages');
const checkHistory = require('./checkHistory');
const writeHistory = require('./writeHistory');
const parseRawBirthdayData = require('./parseRawBirthdayData');
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
    let spinner;
    try {
        spinner = new Ora({
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
        const links = resolveLinks(birthday_data.raw_links);
        const names = resolveNames(birthday_data.raw_names);

        // console.log("data fetched");
        spinner.succeed();
        if (names.fullNames.length === 0) {
            process.stdout.write("No birthdays today!! \n".blue.bold);
        }
        else {
            let count = 1;
            console.log("\n-----------------------------------------------".yellow);
            names.fullNames.forEach(name => {
                const bname = name.replace(/[0-9]/, (x) => ` - ${x}`);
                process.stdout.write(`${count}.  ${bname} \n`.yellow);
                count++;
            });
            console.log();
        }
        spinner = new Ora({
            text: 'Checking if Birthday wish was sent before'.green.bold,
            stream: process.stdout
        });
        spinner.start();
        const prevLinks = await checkHistory(spinner);
        spinner.succeed();

        // remove those links from links.messageLinks already present in prevLinks and names as well
        const newLinks = links.messageLinks.filter((link, i) => {
            if (prevLinks.find(plink => plink === link) === undefined) // when not found, returns true
                return true;
            names.firstNames.splice(i, 1);
            names.fullNames.splice(i, 1);
            return false;
        });

        if (newLinks.length === 0) {
            console.log("\n No new birthday wishes to be send. \n Exiting now...".red);
            await browser.close();
            return;
        }
        spinner = new Ora({
            text: 'Sending Birthday wishes'.green.bold,
            stream: process.stdout
        });
        spinner.start();
        if (newLinks.length === names.firstNames.length) {
            spinner.text = 'Sending Birthday wishes - with names'.green.bold;
            await initMessages(
                browser,
                newLinks,
                names.firstNames
            );
        } else {
            spinner.text = 'Sending Birthday wishes - with names'.green.bold;
            await initMessages(browser, newLinks);
        }

        await page.waitFor(10000);
        spinner.text = 'Sending Birthday wishes - message sent'.green.bold;
        spinner.succeed();
        spinner = new Ora({
            text: 'Updating sent history'.green.bold,
            stream: process.stdout
        });
        spinner.start();
        await writeHistory(newLinks.concat(prevLinks), spinner);
        spinner.succeed();
        spinner = new Ora({
            text: 'Sending email notification'.green.bold,
            stream: process.stdout
        });
        spinner.start();
        email.notifyMe(newLinks, names.fullNames);
        spinner.succeed();
        await browser.close();

    } catch (e) {
        if (spinner)
            spinner.fail();
        console.log('\n', logSymbols.error.red.bold, ' ', e.message.red.bold);
        await browser.close();
        process.exit(0);
    }

}

module.exports = { main };
