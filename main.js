const path = require('path');
const pup = require('puppeteer');
const resolveData = require('./resolve_raw_data');
const email = require('./email_notification');

const PATH_TO_DOTENV = path.resolve(__dirname, '.env');

require('dotenv').config({
    path: PATH_TO_DOTENV
});

const LOGIN_URL = 'https://www.fb.com/login';
const BIRTHDAY_URL =  'https://www.facebook.com/events/birthdays/';
const fbID = process.env.FB_ID;
const fbPass = process.env.FB_PASS;

async function login(page) {
    try {
        await page.goto(LOGIN_URL);
        console.log('login url opened\nfilling entries...\nid: '+fbID+'\npass: '+fbPass);
        await page.type('#email', fbID);
        await page.type('#pass', fbPass);
        await page.waitFor(1000);
        console.log('entries filled\nlogging in...');
        await page.click('#loginbutton');
        return true;
    } catch (error) {
        console.log('LOGIN FAILED!');
        throw new Error(error);
    }
}

async function getRawBirthdayData(page) {
    try {
        await page.goto(BIRTHDAY_URL);
        console.log('birthday page opened\nscraping birthdays...');

        const results = await page.evaluate(() => {
            let raw_links = document.querySelector('#birthdays_content > div._4-u2._tzh._fbBirthdays__todayCard._4-u8 > div:nth-child(2)').innerHTML;
            let raw_names = document.querySelector('#birthdays_content > div._4-u2._tzh._fbBirthdays__todayCard._4-u8 > div:nth-child(2)').innerText;

            return {
                raw_links,
                raw_names
            };
        });
        return results;
    } catch (error) {
        console.log('FAILED!');
        throw new Error(error);
    }
}

async function sendMessage(page, link, message){
    await page.goto(link, {waitUntil: 'networkidle2'});
    await page.keyboard.type(message);
    await page.keyboard.press('Enter');
}

async function initMessages(browser, messageLinks, firstNames=undefined) {
    for(let i=0; i<messageLinks.length; i++){
        let message = undefined;
        if (firstNames){
            message = 'Hey ' + firstNames[i] + '! Happy Birthday :D';
        }
        else {
            message = 'Hey! Happy Birthday :D';
        }
        const page = await browser.newPage();
        sendMessage(page, messageLinks[i], message);
    }
}

async function main() {
    const browser = await pup.launch({
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    console.log('trying to login...');
    await login(page);
    console.log('successfully logged in');
    await page.waitFor(10000);

    console.log('getting birthdays...');
    const birthday_data = await getRawBirthdayData(page);
    page.close();
    console.log('links received');

    console.log('extracting details from received raw data...');
    const links = await resolveData.resolveLinks(birthday_data.raw_links);
    const names = await resolveData.resolveNames(birthday_data.raw_names);
    // console.log(links.messageLinks);
    console.log('data fetched');

    if (links.messageLinks.length === names.firstNames.length){
        console.log('sending messages with names');
        await initMessages(browser, links.messageLinks, names.firstNames);
    }
    else{
        console.log('sending messages without name, length mismatch!');
        await initMessages(browser, links.messageLinks);
    }

    await page.waitFor(10000);
    console.log('messages sent...');
    email.notifyMe(links.profileLinks, names.fullNames);
    console.log('sending mail notification...');
    await browser.close();
}

module.exports = {main};
