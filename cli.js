#!/usr/bin/env node

const program = require("commander");
const { prompt, Separator } = require("inquirer");
const pjson = require("./package.json");
const chalk = require("chalk");

const env_query = [
  {
    type: "input",
    name: "FB_ID",
    message: chalk.green("Your Facebook Id(Eg: John.lennon.84):")
  },
  {
    type: "input",
    name: "FB_PASS",
    message: chalk.green("Your Facebook password:")
  },
  {
    type: "input",
    name: "EMAIL",
    message: chalk.green("Your email address:")
  },
  {
    type: "input",
    name: "EMAIL_PASS",
    message: chalk.green("Password of your email account:")
  },
  {
    type: "input",
    name: "MAILTO",
    default: (env_values) => (env_values.EMAIL),
    message: chalk.green("Email address to send notification:")
  },
  {
    type: "list",
    name: "sam",
    choices: ["choice a", new Separator(), "choice b", "c"],
    message: chalk.red("Choose one")
  }
];

//CLI-info
program.version(pjson.version, "-v --version").description(pjson.description);

program
  .command('env')
  .alias('e')
  .description('Creates a .env file and stores the environment variables')
  .action(() => {
    prompt(env_query).then((env_values) => {
      console.log(env_values);
    });
  });

program.parse(process.argv);

/*
run directly from terminal using ./cli.js
remember to run : npm unlink
*/
