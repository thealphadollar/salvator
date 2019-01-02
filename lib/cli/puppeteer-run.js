const fs = require("fs");
const path = require("path");
const Listr = require("listr");

const PATH_TO_DOTENV = path.resolve(__dirname, "../../.env");
const { main } = require('../main');

const puppeteer_run = () => {
    console.log(`\n${`Thank you for using salvator. You can contribute to the project:`.blue} ${`https://github.com/thealphadollar/salvator`.yellow.bold}\n`);
    /*
    1. Check if .env file exists or not
    2. run node index.js
    */
    const tasks = new Listr([
        {
            title: "Checking the presence of .env file".magenta,
            task: (ctx, task) => {
                if (fs.existsSync(PATH_TO_DOTENV)) {
                    ctx.env = true;
                } else {
                    ctx.env = false;
                    task.skip(
                        `Please create .env file and store your credentials by running 'puppeteer-salvator env'`
                    );
                }
            }
        },
        {
            title: "Running main script\n".magenta,
            enabled: ctx => ctx.env,
            task: () => {
                main();
            }
        }
    ]);

    tasks.run().catch(err => console.error(err));
}

module.exports = puppeteer_run;