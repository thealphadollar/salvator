const chalk = require('chalk');

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
      default: env_values => env_values.EMAIL,
      message: chalk.green("Email address to send notification:")
    }
  ];

  module.exports = {env_query};