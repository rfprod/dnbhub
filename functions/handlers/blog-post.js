exports.handler = (admin, mailTransporter) => {
  /**
   * Fallback function if mail transporter returns an error on submitBlogPostOverEmail
   */
  const saveBlogPostOverEmailToDB = (email, link, domain, res) => {
    const entry = {
      email: email,
      link: link,
      domain: domain,
    };
    admin
      .database()
      .ref('/emails/blogSubmissions')
      .push(entry)
      .then(snapshot => {
        res.status(200).json({ success: 'Your message was successfully sent' });
      })
      .catch(error => {
        res.status(500).send('Error: try again later, please');
      });
  };

  /**
   * Submit a blog post anonimously over email using nodemailer
   */
  const submitBlogPostOverEmail = (email, link, domain, res) => {
    const mailOptions = {
      from: '"DNBHUB 👥" <' + process.env.MAILER_EMAIL + '>',
      to: process.env.MAILER_RECIPIENT_EMAIL,
      subject: `DNBHUB: blod submission ✔`,
      text: `Soundclou playlist link: ${link}\n\nFrom: ${email}\n\nMessage was sent from domain: ${domain}`,
      html: `<p>Soundcloud playlist link: ${link}</p><p>From: ${email}</p><p>Message was sent from domain: ${domain}</p>`,
    };
    mailTransporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // console.log('Mail transporter error:', err);
        /*
         *	do not report error to user yet
         *	try recording message to DB first
         */
        // res.status(500).send('Mail transporter error');
        saveBlogPostOverEmailToDB(email, link, domain, res);
      } else {
        // console.log('Message sent: ' + info.response);
        res.status(200).json({ success: 'Your message was successfully sent' });
      }
    });
  };

  const submitBlogPostOverEmailHandler = (req, res) => {
    if (req.method !== 'POST') {
      res.status(403).json({ error: 'Forbidden method' });
    }
    const email = req.body.email || '';
    const link = req.body.link || '';
    const domain = req.body.domain || '';
    if (
      /\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) &&
      /https:\/\/soundcloud\.com\/\w+[^/]*\/sets\/\w+[^/]*/.test(link) &&
      domain.length >= 4
    ) {
      // res.status(200).json({'success': 'Your message was successfully sent.'});
      submitBlogPostOverEmail(email, link, domain, res);
    } else {
      res.status(400).send('Missing mandatory request parameters or invalid values');
    }
  };

  return { submitBlogPostOverEmailHandler };
};
