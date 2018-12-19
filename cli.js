#!/usr/bin/env node

/* eslint-disable camelcase */
const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const execa = require("execa");
const Listr = require("listr");
const fs = require("fs");
const path = require("path");
const logSymbols = require("log-symbols");
const child_process = require("child_process");

const pjson = require("./package.json");
const { env_query } = require("./lib/cli/questions_cli.js");

const PATH_TO_DOTENV = path.resolve(__dirname, '.env');
const PATH_TO_INDEX = path.resolve(__dirname, 'index.js');

program
  .version(pjson.version, "-v --version")
  .description(chalk.yellowBright.bold(pjson.description));

program
  .command("env")
  .description(
    chalk.blue(
      "Load environment variables in .env file(fb_id, fb_pass, email, ..)"
    )
  )
  .action(() => {
    inquirer.prompt(env_query).then(env_values => {
      const file = fs.createWriteStream(PATH_TO_DOTENV);
      Object.keys(env_values).forEach(element => {
        file.write(`${element}=${env_values[element]}\n`);
      });

      file.end();
      console.log(
        chalk.green.bold(
          "\n--------------------------------------------------------------\n"
        )
      );
      console.log(
        logSymbols.success,
        chalk.green.bold("Environment variables loaded in .env file\n")
      );
    });
  });

program
  .command("run")
  .description(chalk.blue("Run the automated Birthday wish script"))
  .action(() => {
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
          } catch (err) {
            console.log(`Error: ${err}`);
          }
        }
      }
    ]);

    tasks.run().catch(err => console.error(err));
  });

program
  .command("cron")
  .description(
    chalk.blue(
      "Add a cronjob delete a cronjob, view all cronjobs"
    )
  )
  .action(async () => {
    try {
      child_process.execFileSync('./cron.sh', { stdio: 'inherit' });
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  });

program
  .command("*")
  .description(chalk.blue("When no matching commands are entered"))
  .action((/* env */) => {
    console.log(logSymbols.warning, chalk.red(" Command not available"));
    console.log(chalk.blue("Type --help to see all the available commands"));
  });

program.parse(process.argv);

// when no arguments are specified
const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  console.log("\n\n");
  console.log(
    chalk.yellow.bold(
      "---------------------------------------------------------"
    )
  );
  console.log(
    chalk.greenBright.bold(`\n                   PUPPETEER SALVATOR\n`)
  );
  console.log(
    chalk.yellow.bold(
      "---------------------------------------------------------"
    )
  );
  program.help();
}

/*
Steps to test this cli-tool locally:
1. npm link
2. open terminal, run 'puppeteer-salvator' from anywhere
3. when done checking, run 'npm unlink'
4. (for the owner of this repo) : run 'npm publish' to publish this as an npm cli-tool on npmjs.com
*/
