const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'eyaayouta53@gmail.com', // your Gmail address
        pass: 'owdztljcspexocyi',  // your Gmail password or app password
    },
});

// Define the sendEmail function
const sendEmail = async (to, subject, text, html, attachments) => {
    // Setup email data with unicode symbols
    let mailOptions = {
        from: '"EduCheck" eyaayouta53@gmail.com>',
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
module.exports = sendEmail;

