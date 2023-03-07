const nodemailer = require('nodemailer');
const catchAsync = require('./asyncError');


const sendEmail = catchAsync(async(options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD
        }
      });
    const mailOptions = {
        from : 'Gaurav Mishra <gaurav.info216@gmail.com>',
        to : options.email,
        subject : options.subject,
        text : options.message
    }
    // send email
    await transporter.sendMail(mailOptions);
});

module.exports = {
    sendEmail
};