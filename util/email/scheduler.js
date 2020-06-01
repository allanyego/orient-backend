if (process.env.NODE_ENV === "production") {
  const CronJob = require("cron").CronJob;
  const { getExpired } = require("../../controllers/policies");
  const { sendExpiryReminder } = require("./index");

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

module.exports = job;
