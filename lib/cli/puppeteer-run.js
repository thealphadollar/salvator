const fs = require("fs");
const path = require("path");
const execa = require("execa");
const Listr = require("listr");
const logSymbols = require('log-symbols');

const PATH_TO_DOTENV = path.resolve(__dirname, "../../.env");
const PATH_TO_INDEX = path.resolve(__dirname, '../../index.js');

const puppeteer_run = () => {
    console.log("Running index.js");
    /*
    1. Check if .env file exists or not
    2. run node index.js
    */
    const tasks = new Listr([
        {
            title: "Checking the presence of .env file",
            task: (ctx, task) => {
                if (fs.existsSync(PATH_TO_DOTENV)) {
                    ctx.env = true;
                } else {
                    ctx.env = false;
                    task.skip(
                        `Please create .env file by running 'puppeteer-salvator env'`
                    );
                }
            }
        },
        {
            title: "Running index.js",
            enabled: ctx => ctx.env,
            task: async () => {
                try {
                    const stream = execa("node", [PATH_TO_INDEX]).stdout;
                    /* child.stdout.on('data', (data) => {
                      process.stdout(data);
                    }); */
                    stream.pipe(process.stdout);
                } catch (e) {
                    process.stdout.write(`${logSymbols.error} ${e.message.red} \n`);
                }
            }
        }
    ]);

    tasks.run().catch(err => console.error(err));
}

module.exports = puppeteer_run;