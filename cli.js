#!/usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const execa = require("execa");
const Listr = require("listr");
const input = require("listr-input");
const fs = require("fs");
const Observable = require('rxjs').Observable;
const through = require('through');

const pjson = require("./package.json");
const {env_query} = require('./questions_cli.js')




const tasks = new Listr([
  /*{
    title: "Install package dependencies with npm",
    //enabled: ctx => ctx.yarn === false,
    task: () => execa("npm", ["install"])
  },
  ,*/
  {
    title: "Enter environment variables",
    task: () => {
      return new Observable(observer => {
        let buffer = "";

        const outputStream = through(data => {
          if (/\u001b\[.*?(D|C)$/.test(data)) {
            if (buffer.length > 0) {
              observer.next(buffer);
              buffer = "";
            }
            return;
          }

          buffer += data;
        });

        const prompt = inquirer.createPromptModule({
          output: outputStream
        });

        prompt(env_query)
          .then(env_values => {
            observer.next(); // Clear the output
						const file = fs.createWriteStream('.log');
						for(let property in env_values) {
							file.write(`${property}:${env_values[property]}\n`);
						}
						file.end();
					})
					.then(() => {
						observer.complete();
					})
          .catch(err => {
            observer.error(err);
					});
        return outputStream;
      });
    }
	},
	{
    title: "Running index.js",
    task: () => execa("node", ["index.js"])
  }
]);

tasks.run().catch(err => console.error(err));
