require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var apiRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", apiRouter);
app.use((err, req, res, next) => {
  console.log("ERROR OOOH", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
});

if (process.env.NODE_ENV === "production") {
  const CronJob = require("cron").CronJob;
  const { getExpired } = require("./controllers/policies");
  const { sendExpiryReminder } = require("./util/email/index");

  // Schedule job for everyday at 10am
  const job = new CronJob("00 00 10 * * *", async function () {
    try {
      const expireds = await getExpired();

      expireds.forEach(async (exp) => {
        const { email, ...rest } = exp;
        await sendExpiryReminder({
          message: {
            to: email,
            subject: "Policy Expiration.",
          },
          locals: rest,
        });
      });
    } catch (e) {
      // TODO: implement robust logging
      console.log("Problem sending email:", e);
    }
  });

  job.start();
}

module.exports = app;
