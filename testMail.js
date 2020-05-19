const Email = require("email-templates");

const email = new Email({
  message: {
    from: "devyego@gmail.com",
  },
  send: true,
  transport: {
    jsonTransport: true,
  },
});

email
  .send({
    template: "mars",
    message: {
      to: "allanyego05@gmail.com",
    },
    locals: {
      name: "yegow",
    },
  })
  .then((res) => console.log(res.originalMessage));
