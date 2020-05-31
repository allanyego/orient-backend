const emailFactory = require("./emailFactory");

module.exports = function template({
  templateUrl,
  message = {
    from, // sender address
    to, // list of receivers
    subject, // Subject line
  },
  locals = {
    name,
    policyNumber,
    from,
    to,
    expiryDate,
  },
  test = true,
  transporter,
}) {
  const email = emailFactory({ test });

  function render() {
    return email.render(`${templateUrl}/html`, locals);
  }

  async function send() {
    let html;

    try {
      html = await render();
    } catch (error) {
      throw error;
    }

    return transporter.sendMail({
      ...message,
      // text: "Hello world?", // plain text body
      html: html, // html body
    });
  }

  async function sendTest() {
    return email.send({
      template: templateUrl,
      locals: locals,
      message,
    });
  }

  return {
    send: !test && !!transporter ? send : sendTest,
    render,
  };
};
