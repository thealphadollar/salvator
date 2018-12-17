/* eslint-disable camelcase */
const chalk = require("chalk");
const path = require("path");

const PATH_TO_DOTENV = path.resolve(__dirname, ".env");

require("dotenv").config({
  path: PATH_TO_DOTENV
});

const env_query = [
  {
    type: "input",
    name: "FB_ID",
    default: process.env.FB_ID || "",
    message: chalk.yellow("Your Facebook Id(Eg: John.lennon.84):")
  },
  {
    type: "input",
    name: "FB_PASS",
    default: process.env.FB_PASS || "",
    message: chalk.yellow("Your Facebook password:")
  },
  {
    type: "input",
    name: "EMAIL",
    default: process.env.EMAIL || "",
    message: chalk.yellow("Your email address:")
  },
  {
    type: "input",
    name: "EMAIL_PASS",
    default: process.env.EMAIL_PASS || "",
    message: chalk.yellow("Password of your email account:")
  },
  {
    type: "input",
    name: "MAILTO",
    default: env_values => process.env.MAILTO || env_values.EMAIL,
    message: chalk.yellow("Email address to send notification:")
  }
];

module.exports = { env_query };
