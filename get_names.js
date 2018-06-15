const pup = require('puppeteer');

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
        console.log('entries filled\nlogging in...');
        await page.click('#loginbutton');
        return true;
    } catch (error) {
        console.log('LOGIN FAILED!');
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
    login(page).then(success => {
       if (success){
           console.log('successfully logged in');
       }
    });
    await page.waitFor(10000);


    await browser.close();
}

module.exports = {email, pass, openFB};