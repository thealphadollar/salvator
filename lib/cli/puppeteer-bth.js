const Ora = require("ora");
const path = require("path");
const pup = require("puppeteer");
const logSymbols = require("log-symbols");

const getBirthdayData = require('../getBirthdayData');

const PATH_TO_DOTENV = path.resolve(__dirname, "../../.env");


require("dotenv").config({
    path: PATH_TO_DOTENV
});


const fbID = process.env.FB_ID;
const fbPass = process.env.FB_PASS;


const puppeteer_bth = async () => {
    const spinner = new Ora({
        text: 'Getting the names of friends who have birthday today\n'.green.bold,
        spinner: process.argv[2],
    });

    spinner.start();
    global.console = console || {};
    console.log = function () { };

    const browser = await pup.launch({
        // headless: false,
        args: ["--no-sandbox", "--disable-notifications"]
    });

    try {
        const data = await getBirthdayData(browser, fbID, fbPass);
        spinner.succeed();
        if (data.names.fullNames.length === 0) {
            process.stdout.write("No birthdays today!! \n".blue.bold);
        }
        else {
            let count = 1;
            data.names.fullNames = data.names.fullNames.forEach(name => {
                const bname = name.replace(/[0-9]/, (x) => ` - ${x}`);
                process.stdout.write(`${count}.  ${bname} \n`.yellow);
                count++;
            });
        }
        await browser.close();
    } catch (e) {
        spinner.fail();

        process.stdout.write(`${logSymbols.error} ${e.message.red} \n`);
        await browser.close();
        process.exit(0);
    }
};

module.exports = puppeteer_bth;