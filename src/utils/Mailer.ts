import nodemailer from "nodemailer";

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3d00322b681d70",
    pass: "0014b1beb97a8b",
  },
});

const mailOptions = {
  from: "sender@gmail.com", // Sender address
  to: "vkg1617@gmail.com", // List of recipients
  subject: "Node Mailer", // Subject line
  text: "Your otp is as follows:", // Plain text body
};

transport.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.log(err);
  } else {
    console.log(info);
  }
});
