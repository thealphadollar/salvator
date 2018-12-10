const path = require('path');
const os = require('os');
const pup = require('puppeteer');
const resolveData = require('./resolve_raw_data');
const email = require('./email_notification');

const PATH_TO_DOTENV = path.resolve(__dirname, '.env');
const THREE_GB = 3072*1024*1024;

require('dotenv').config({
    path: PATH_TO_DOTENV
});

const LOGIN_URL = 'https://www.fb.com/login';
const BIRTHDAY_URL =  'https://www.facebook.com/events/birthdays/';
const fbID = process.env.FB_ID;
const fbPass = process.env.FB_PASS;

async function genWish()
{
  const wishes = [
  'Happy Birthday !!',
  'Happy Birthday! Have a blast.',
  'Many more happy returns of the day',
  'I wish you all the happiness in the world! Happy Birthday.',
  'Just live it out to the fullest and have fun! Happy Birthday',
  'I hope you have the best day ever. Happy Birthday!',
  'Happy Birthday!! May all of your birthday wishes come true.',
  'Happy Birthday! Welcome to the new age.'];

  let randomnumber = await Math.floor(Math.random() * (wishes.length)) ;
  return wishes[randomnumber];
}
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
        await page.waitFor(5000);
        const results = await page.evaluate(() => {
            let raw_links = document.querySelector('#birthdays_content > div:nth-child(1) > div:nth-child(2) > ul').innerHTML;
            let raw_names = document.querySelector('#birthdays_content > div:nth-child(1) > div:nth-child(2) > ul').innerText;

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
    await page.waitFor(5000);
    await page.close();
}

async function initMessages(browser, messageLinks, prevLinks, firstNames=undefined) {
    let to_await = false;
    if (os.totalmem() < THREE_GB) {
        to_await = true;
    }

    for(let i=0; i<messageLinks.length; i++) {
        let message = undefined;
        if(prevLinks.indexOf(messageLinks[i])>-1)
          continue;
        var ranWish=await genWish();
        if (firstNames) {
            message = 'Hey ' + firstNames[i] +' '+ ranWish;
        }
        else {
            message = 'Hey! '+ranWish;
        }
        const page = await browser.newPage();
        to_await=true;
        if (to_await) {
            // console.log(messageLinks[i]);
             await sendMessage(page, messageLinks[i], message);
        } else {
             sendMessage(page, messageLinks[i], message);
        }
    }
}


async function checkHistory(){
  array=[];
	const d1=new Date();
  const fs = require('fs');
  try {
      var data= fs.readFileSync('data.json', 'utf8');
      var obj=JSON.parse(data);
  } catch(e) {
      console.log('Error:', e.stack);
  }

	const d2=new Date(obj['date']);
	let flag=(d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() &&d1.getDate() === d2.getDate());

  if(flag===false)
    return array;
  for(let i=0;i<obj["links"].length;i++)
    array[i]=obj["links"][i];

  console.log("previous links array generated successfully");
  return array;
}

async function writeHistory(messageLinks, prevLinks){
	const d=new Date();
  let list=[];
  for(let i=0;i<messageLinks.length;i++){
    list.push(messageLinks[i]);
  }
  for(let i=0;i<prevLinks.length;i++){
    if(list.indexOf(prevLinks[i])>-1)
      continue;
    list.push(prevLinks[i]);
  }
  let obj={};
  obj.date=d;
  obj.links=list;

  const fs=require('fs');
  const content=JSON.stringify(obj);

  fs.writeFile('data.json', content, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    });
}

async function main() {
    const browser = await pup.launch({
        //headless: false,
        args: ['--no-sandbox', '--disable-notifications']
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

    console.log('Checking write history');
    const prevLinks=await checkHistory();
    writeHistory(links.messageLinks,prevLinks);

    if (links.messageLinks.length === 0){
     console.log("No Birthdays found. Exiting in 3 seconds...");
     await page.waitFor(3000);
     await browser.close();
     return;
    }
    if (links.messageLinks.length === names.firstNames.length){
        console.log('sending messages with names');
        await initMessages(browser, links.messageLinks,prevLinks, names.firstNames);
    }
    else{
        console.log('sending messages without name, length mismatch!');
        await initMessages(browser, links.messageLinks, prevLinks);
    }

    await page.waitFor(10000);
    console.log('messages sent...');
    email.notifyMe(links.profileLinks, names.fullNames);
    console.log('sending mail notification...');
    await browser.close();
}

module.exports = {main};
