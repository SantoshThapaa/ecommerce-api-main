const nodemailer = require('nodemailer')

const sendEmail = options => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
    }
    transport.sendMail(mailOptions)
}

module.exports = sendEmail