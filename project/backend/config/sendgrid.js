const sendgrid = require('@sendgrid/mail');

// Configure SendGrid with the API key from the environment
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = sendgrid;
