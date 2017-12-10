const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

/*
*	Create and Deploy Cloud Functions
*	https://firebase.google.com/docs/functions/write-firebase-functions
*
*	basic usage example
*
* exports.helloWorld = functions.https.onRequest((request, response) => {
*		response.send('Hello from Firebase!');
*	});
*/

/*
*	load .env variables
*/
require('dotenv').load();

/*
* nodemailer usage notice:
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
		accessToken: 'empty'
	}
};
/*
*	reusable transporter object using the default SMTP transport
*/
const mailTransporter = nodemailer.createTransport(smtpConfig);
mailTransporter.verify((err, success) => {
	if (err) {
		console.log('Mail transporter diag error >>', err);
	} else {
		console.log('Mail transporter diag success >>', success);
	}
});

function sendEmail(name, email, header, message, domain, res) {
	const mailOptions = {
		from: '"DNBHUB 👥" <' + process.env.MAILER_EMAIL +'>',
		to: process.env.MAILER_RECIPIENT_EMAIL,
		subject: `DNBHUB: ${header} ✔`,
		text: `${message}\n\nMessage was sent from domain: ${domain}`,
		html: `<h3>${header}</h3><p>${message}</p><p>From: ${name} ${email}</p><p>Message was sent from domain: ${domain}</p>`
	};
	mailTransporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			// console.log('Mail transporter error:', err);
			res.status(500).send('Mail transporter error');
		} else {
			// console.log('Message sent: ' + info.response);
			res.status(200).json({success: 'Your message was successfully sent'});
		}
	});
}

exports.sendEmail = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}
	const name = req.body.name || '';
	const email = req.body.email || '';
	const header = req.body.header || '';
	const message = req.body.message || '';
	const domain = req.body.domain || '';
	if (name.length >= 2 && /\w{2}@\w{2,}(\.)?\w{2,}/.test(email) && header.length >= 5 && message.length >= 75 && domain.length >= 4) {
		// res.status(200).json({'success': 'Your message was successfully sent.'});
		sendEmail(name, email, header, message, domain, res);
	} else {
		res.status(400).json({error: 'Missing mandatory request parameters or invalid values'});
	}
});

function submitBlogPostOverEmail(email, link, domain, res) {
	const mailOptions = {
		from: '"DNBHUB 👥" <' + process.env.MAILER_EMAIL +'>',
		to: process.env.MAILER_RECIPIENT_EMAIL,
		subject: `DNBHUB: blod submission ✔`,
		text: `Soundclou playlist link: ${link}\n\nFrom: ${email}\n\nMessage was sent from domain: ${domain}`,
		html: `<p>Soundcloud playlist link: ${link}</p><p>From: ${email}</p><p>Message was sent from domain: ${domain}</p>`
	};
	mailTransporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			// console.log('Mail transporter error:', err);
			res.status(500).send('Mail transporter error');
		} else {
			// console.log('Message sent: ' + info.response);
			res.status(200).json({success: 'Your message was successfully sent'});
		}
	});
}

exports.submitBlogPostOverEmail = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}
	const email = req.body.email || '';
	const link = req.body.link || '';
	const domain = req.body.domain || '';
	if (/\w{2}@\w{2,}(\.)?\w{2,}/.test(email) && /https:\/\/soundcloud\.com\/\w+\/sets\/\w+/.test(link) && domain.length >= 4) {
		// res.status(200).json({'success': 'Your message was successfully sent.'});
		submitBlogPostOverEmail(email, link, domain, res);
	} else {
		res.status(400).json({error: 'Missing mandatory request parameters or invalid values'});
	}
});
