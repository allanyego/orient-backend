// require("dotenv").config();
// const nodemailer = require("nodemailer");
const template = require("./template");

// create reusable transporter object using the default SMTP transport
// const testUser = nodemailer.createTestAccount();

// testUser.then(({ user, pass }) => {
//   let transporter = nodemailer.createTransport({
//     // host: process.env.EMAIL_HOST,
//     // port: process.env.EMAIL_PORT,
//     // secure: false, // true for 465, false for other ports
//     // auth: {
//     //   user: user, // generated ethereal user
//     //   pass: pass, // generated ethereal password
//     // },
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     tls: true,
//     auth: {
//       user: "devyego@gmail.com", // generated ethereal user
//       pass: "dot1love", // generated ethereal password
//     },
//   });
// });

async function runTest() {
  const message = {
      from: '"Dev Yego 👻" <devyego@gmail.com>', // sender address
      to: "allanyego05@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
    },
    locals = {
      firstName: "yego",
      policyNumber: "mmm/56356/9098",
      policyPeriodStart: "2020-05-29T13:09:13.078Z",
      policyPeriodEnd: "2021-05-29T13:09:13.078Z",
    };

  try {
    const ctr = await template({
      templateUrl: "expiry",
      message,
      locals,
    });

    ctr.send().then(console.log);
    // ctr.render().then(console.log);
  } catch (error) {
    console.error(error);
  }
}

runTest();
