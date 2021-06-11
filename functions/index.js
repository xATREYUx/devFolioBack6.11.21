const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({
  origin: true,
});

const fired = () => {
  console.log("functions fired");
};
fired();
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

exports.submit = functions.https.onRequest((req, res) => {
  console.log("req.body.email", req.body.email);
  if (req.method === "OPTIONS") {
    res.end();
  } else {
    cors(req, res, () => {
      if (req.method !== "POST") {
        return;
      }

      const mailOptions = {
        from: req.body.email,
        replyTo: req.body.email,
        to: gmailEmail,
        subject: `${req.body.name} just messaged me from my website`,
        text: req.body.message,
        html: `<p>${req.body.message}</p>`,
      };

      return mailTransport.sendMail(mailOptions).then(() => {
        console.log("New email sent to:", gmailEmail);
        res.status(200).send({
          isEmailSend: true,
        });
        return;
      });
    });
  }
});
