# Drum'n'Bass Hub

![build](https://travis-ci.org/rfprod/dnbhub.svg?branch=master)

[See it in action](http://dnbhub.com)

### Environment variables

these are required and used by a `gulp` task `pack-app-js`, variables should be stored in `.env` file in the project root

```
SOUNDCLOUD_CLIENT_ID=soundcloud_client_id
FIREBASE_API_KEY=firebase_api_key
FIREBASE_AUTH_DOMAIN=firebase_auth_domain
FIREBASE_DATABASE_URL=firebase_database_url
FIREBASE_PROJECT_ID=firebase_project_id
FIREBASE_STORAGE_BUCKET=firebase_storeage_bucket
FIREBASE_MESSAGING_SENDER_ID=firebase_messaging_sender_id
PRIVILEGED_ACCESS_FIREBASE_UID=privileged_access_firebase_uid
```

### Installation and Start

```
npm start
```

installs local dependencies, sets file watchers for server, database, frontend, which trigger:

* preprocession, concatenation, minification of the project files where needed
* server or database restart
* server testing
* frontend testing

### Note

if built project is hosted on a webserver without NodeJS support, the following should be added to `./htaccess` for AngularJS routing to work properly:

```
RewriteEngine on
Options FollowSymLinks
ReqriteBase /
ReqriteCond %{REQUEST_FILENAME} !-f
ReqriteCond %{REQUEST_FILENAME} !-d
ReqriteRule ^(.*)$ /#/$1 [L]
```

### Firebase deploment (hosting + cloud functions)

requires manual `.env` file creation in the directory `./functions/` with the following contents

```
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_EMAIL=sender_email_address@gmail.com
MAILER_CLIENT_ID=mailer_client_id.apps.googleusercontent.com
MAILER_CLIENT_SECRET=mailer_client_secret
MAILER_REFRESH_TOKEN=mailer_refresh_token
MAILER_RECIPIENT_EMAIL=recipient_email_address@any_domain.tld
```

To use Gmail you may need to configure [Allow Less Secure Apps](https://www.google.com/settings/security/lesssecureapps) in your Gmail account unless you are using 2FA in which case you would have to create an [Application Specific password](https://security.google.com/settings/security/apppasswords). You may also need to unlock your account with [Allow access to your Google account](https://accounts.google.com/DisplayUnlockCaptcha) to use SMTP.

#### Deploy

deploy the whole project

```
firebase deploy
```

only hosting

```
firebase deploy --only hosting
```

only functions

```
firebase deploy --only functions
```

## Licenses

* [`Dnbhub`](LICENSE.md)
