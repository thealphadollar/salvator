#!/usr/bin/env node

/* eslint-disable camelcase */

const program = require("commander");
const logSymbols = require("log-symbols");

require("colors");

const pjson = require("./package.json");

const puppeteer_env = require('./lib/cli/puppeteer-env');
const puppeteer_run = require('./lib/cli/puppeteer-run');
const puppeteer_cron = require('./lib/cli/puppeteer-cron');
const puppeteer_bth = require('./lib/cli/puppeteer-bth');


/* --------------------------Commands ------------------------- */

program
  .version(pjson.version, "-v --version")
  .description(pjson.description.yellow.bold);

program
  .command("env")
  .description("Load environment variables in .env file(fb_id, fb_pass, email, ..)".blue)
  .action(puppeteer_env);

program
  .command("run")
  .description("Run the automated Birthday wish script".blue)
  .action(puppeteer_run);

program
  .command("cron")
  .description("Add a cronjob delete a cronjob, view all cronjobs".blue)
  .action(puppeteer_cron);

program
  .command("bth")
  .description("Show all the birthdays for the current day".blue)
  .action(puppeteer_bth);

program
  .command("*")
  .description("When no matching commands are entered".blue)
  .action(() => {
    console.log(logSymbols.warning, " Command not available".red);
    console.log("Type --help to see all the available commands".blue);
  });

program.parse(process.argv);

// when no arguments are specified
const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  console.log("---------------------------------------------------------".yellow.bold);
  console.log(`\n                   PUPPETEER SALVATOR\n`.green.bold);
  console.log("---------------------------------------------------------".yellow.bold);
  program.help();
}
