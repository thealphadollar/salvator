const fs = require('fs');
const path = require('path');
const inquirer = require("inquirer");
const logSymbols = require('log-symbols');

const { env_query } = require("./questions_cli");

require('colors');

const PATH_TO_DOTENV = path.resolve(__dirname, "../../.env");

const puppeteer_env = () => {
    inquirer.prompt(env_query).then(env_values => {
        const file = fs.createWriteStream(PATH_TO_DOTENV);
        Object.keys(env_values).forEach(element => {
            file.write(`${element}=${env_values[element]}\n`);
        });

        file.end();
        console.log("\n--------------------------------------------------------------\n".green.bold);
        console.log(logSymbols.success, "Environment variables loaded in .env file\n".green.bold);
    });
}

module.exports = puppeteer_env;