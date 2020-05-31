const path = require("path");
const Email = require("email-templates");

module.exports = function emailFactory({
  transport = {
    jsonTransport: true
  },
  test = false,
}) {
  return new Email({
    send: !test,
    transport,
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        //
        // this is the relative directory to your CSS/image assets
        // and its default path is `build/`:
        //
        // e.g. if you have the following in the `<head`> of your template:
        // `<link rel="stylesheet" href="style.css" data-inline="data-inline">`
        // then this assumes that the file `build/style.css` exists
        //
        relativeTo: path.resolve(__dirname, "..", "..", "public"),
        //
        // but you might want to change it to something like:
        // relativeTo: path.join(__dirname, '..', 'assets')
        // (so that you can re-use CSS/images that are used in your web-app)
        //
      },
    },
  });
}
