const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

/**
 *  Load .env variables.
 */
require('dotenv').config();

/**
 * @note Nodemailer usage
 *
 * To use Gmail you may need to configure "Allow Less Secure Apps" (https://www.google.com/settings/security/lesssecureapps)
 * in your Gmail account unless you are using 2FA
 * in which case you would have to create an Application Specific password (https://security.google.com/settings/security/apppasswords).
 * You may also need to unlock your account with "Allow access to your Google account" (https://accounts.google.com/DisplayUnlockCaptcha)
 * to use SMTP.
 */
const smtpConfig = {
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  secure: true, // use SSL
  auth: {
    type: 'OAuth2',
    user: process.env.MAILER_EMAIL,
    clientId: process.env.MAILER_CLIENT_ID,
    clientSecret: process.env.MAILER_CLIENT_SECRET,
    refreshToken: process.env.MAILER_REFRESH_TOKEN,
    accessToken: 'empty',
  },
};

/**
 * Mail transporter.
 */
const mailTransporter = nodemailer.createTransport(smtpConfig);
mailTransporter.verify((err, success) => {
  if (err) {
    console.log('Mail transporter diag error >>', err);
  } else {
    console.log('Mail transporter diag success >>', success);
  }
});

/**
 *  Initialize admin SDK to access Firebase Realtime Database.
 */
admin.initializeApp(functions.config().firebase);

/**
 * Create and Deploy Cloud Functions.
 * https://firebase.google.com/docs/functions/write-firebase-functions
 *
 * Basic usage example.
 *
 *  exports.helloWorld = functions.https.onRequest((request, response) => {
 *    response.send('Hello from Firebase!');
 *  });
 */

/**
 * Send an email.
 */
const sendEmailHandler = require('./handlers/email').handler(admin, mailTransporter);
exports.sendEmail = functions.https.onRequest(sendEmailHandler);

/**
 * Submit a blog post.
 */
const submitBlogPostOverEmailHandler = require('./handlers/blog-post').handler(
  admin,
  mailTransporter,
);
exports.submitBlogPostOverEmail = functions.https.onRequest(submitBlogPostOverEmailHandler);
