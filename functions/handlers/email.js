exports.handler = (admin, mailTransporter) => {
  /**
   * Fallback function if mail transporter returns an error on sendEmail
   */
  const saveEmailToDB = (name, email, header, message, domain, res) => {
    const entry = {
      name: name,
      email: email,
      header: header,
      message: message,
      domain: domain,
    };
    admin
      .database()
      .ref('/emails/messages')
      .push(entry)
      .then(snapshot => {
        res.status(200).json({ success: 'Your message was successfully sent' });
      })
      .catch(error => {
        res.status(500).send('Error: try again later, please');
      });
  };

  /**
   * Send email message using nodemailer.
   */
  const sendEmail = (name, email, header, message, domain, res) => {
    const mailOptions = {
      from: '"DNBHUB 👥" <' + process.env.MAILER_EMAIL + '>',
      to: process.env.MAILER_RECIPIENT_EMAIL,
      subject: `DNBHUB: ${header} ✔`,
      text: `${message}\n\nMessage was sent from domain: ${domain}`,
      html: `<h3>${header}</h3><p>${message}</p><p>From: ${name} ${email}</p><p>Message was sent from domain: ${domain}</p>`,
    };
    mailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // console.log('Mail transporter error:', err);
        /*
         *	do not report error to user yet
         *	try recording message to DB first
         */
        // res.status(500).send('Mail transporter error');
        saveEmailToDB(name, email, header, message, domain, res);
      } else {
        // console.log('Message sent: ' + info.response);
        res.status(200).json({ success: 'Your message was successfully sent' });
      }
    });
  };

  const sendEmailHandler = (req, res) => {
    if (req.method !== 'POST') {
      res.status(403).json({ error: 'Forbidden method' });
    }
    const name = req.body.name || '';
    const email = req.body.email || '';
    const header = req.body.header || '';
    const message = req.body.message || '';
    const domain = req.body.domain || '';
    if (
      name.length >= 2 &&
      /\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) &&
      header.length >= 5 &&
      message.length >= 75 &&
      domain.length >= 4
    ) {
      // res.status(200).json({'success': 'Your message was successfully sent.'});
      sendEmail(name, email, header, message, domain, res);
    } else {
      res.status(400).send('Missing mandatory request parameters or invalid values');
    }
  };

  return { sendEmailHandler };
};
