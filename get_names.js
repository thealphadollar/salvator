const pup = require('puppeteer');
const resolve = require('./resolve_raw_data');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load(); // load environment variables from .env file
}

const LOGIN_URL = 'https://www.fb.com/login';
const BIRTHDAY_URL =  'https://www.facebook.com/events/birthdays/';
const email = process.env.EMAIL;
const pass = process.env.PASS;

async function login(page) {
    try {
        await page.goto(LOGIN_URL);
        console.log('login url opened\nfilling entries...');
        await page.type('#email', email);
        await page.type('#pass', pass);
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

async function openFB() {
    const browser = await pup.launch({
        headless: false,
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    console.log('trying to login...');
    await login(page);
    console.log('successfully logged in');
    await page.waitFor(10000);

    console.log('getting birthdays...');
    const birthday_data = await getRawBirthdayData(page);
    console.log('links received');

    console.log('extracting details from received raw data...');
    const fb_links = resolve.resolveLinks(birthday_data.raw_links);
    const names = resolve.resolveNames(birthday_data.raw_names);

    await page.waitFor(10000);
    await browser.close();
}

module.exports = {openFB};