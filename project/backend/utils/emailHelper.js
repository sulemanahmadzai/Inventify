const sendgrid = require('../config/sendgrid');

exports.createEmailContent = (alertDetails) => {
    return `
        <h2>Stock Alerts</h2>
        <p>Dear Manager,</p>
        <p>Here are the current stock alerts:</p>
        ${alertDetails}
        <p>Best regards,</p>
        <p>Inventify</p>
    `;
};

exports.sendEmail = async (to, subject, htmlContent) => {
    const msg = {
        to,
        from: 'moizq8978@gmail.com',  // Replace with your SendGrid verified email
        subject,
        html: htmlContent,
    };

    await sendgrid.send(msg);
    console.log(`Email sent to: ${to}`);
};
