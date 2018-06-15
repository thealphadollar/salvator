const scheduler = require('node-schedule');
const PIPE = require('./main.js');

const job = scheduler.scheduleJob('5 0 * * *', PIPE.main);
console.log("job added\nNew birthdays will be checked everyday at 00:05!");


while (true){
}