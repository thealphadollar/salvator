const path = require("path");
const logSymbols = require('log-symbols');
const child_process = require("child_process");

const PATH_TO_CRON = path.resolve(__dirname, '../../cron.sh');

const puppeteer_cron = async () => {
    try {
        child_process.execFileSync(PATH_TO_CRON, { stdio: 'inherit' });
    } catch (e) {
        if (e.code === 'ENOENT')
            process.stdout.write(` ${logSymbols.error.red} ${` cron.sh`.yellow} does not exist \n`);
        else
            process.stdout.write(`${logSymbols.error} ${e.message.red} \n`);
    }
};

module.exports = puppeteer_cron;