const mailer = require("nodemailer");

function notifyMe(profileLinks, fullNames) {
  const message = `Birthdays for today are:\n${fullNames.join(
    "\n"
  )}\nLink to their profiles:\n${profileLinks.join("\n")}`;

  const client = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailData = {
    from: process.env.EMAIL,
    to: process.env.MAILTO,
    subject: "Birthday Notification",
    text: message
  };

  try {
    client.sendMail(mailData, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  } catch (e) {
    throw new Error(`Could not send Email notification to ${process.env.MAILTO}`);
  }

}

module.exports = { notifyMe };
