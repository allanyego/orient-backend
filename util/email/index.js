const nodemailer = require("nodemailer");
const template = require('./template');

// create reusable transporter object using the default SMTP transport
// const testUser = nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: true,
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});

let msg = {
  from: "Orient Insurance Co. Ltd.",
}

async function sendApprovalEmail({message, locals}) {
  msg = {
    ...msg,
    ...message,
  };

  const ctr = await template({
    templateUrl: "approval",
    message,
    locals,
    transporter,
    test: false,
  });

  return await ctr.send();
}

async function sendExpiryReminder({message, locals}) {
  msg = {
    ...msg,
    ...message,
  };

  const ctr = await template({
    templateUrl: "expiry",
    message,
    locals,
    transporter,
    test: false,
  });

  return await ctr.send();
}

module.exports = {
  sendApprovalEmail,
  sendExpiryReminder,
};
