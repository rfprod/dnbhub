# Dnbhub

[![Azure DevOps Build Status](https://rfprod.visualstudio.com/Dnbhub/_apis/build/status/Dnbhub-CI?branchName=master)](https://rfprod.visualstudio.com/Dnbhub/_build/latest?definitionId=12&branchName=master)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Client Environment variables

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
GOOGLE_APIS_BROWSER_KEY=google_apis_browser_key
GOOGLE_APIS_CLIENT_ID=google_apis_client_id
```

alternatively a script `set-env.sh` can guide you through the process of setting environment variables, use it like

```
bash ./set-env.sh
```
or
```
npm run set-env
```

#### How to get client environment variables

##### Soundcloud credentials (requires Soundcloud account)

TODO

##### Firebase credentials (requires Google account)

Variables list: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_DATABASE_URL`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`

1. go to [firebase console](https://console.firebase.google.com);
2. add a project;
3. on the project dashboard page hit `Add Firebase to your webapp`, and copy required credentials;

##### Google Apis browser key, client id (requires Google account)

Variables list: `GOOGLE_APIS_BROWSER_KEY`, `GOOGLE_APIS_CLIENT_ID`

1. create credentials via [google developers console](https://console.developers.google.com/apis/credentials), choose `API keys` when selecting credentials type;
2. use `Browser key` as a value for `GOOGLE_APIS_BROWSER_KEY` environment variable;
3. create creadentials via [google developers console](https://console.developers.google.com/apis/credentials), choose `OAuth client ID` when selecting credentials type, use `Client ID` as a value for `GOOGLE_APIS_CLIENT_ID` environment variable.

### Installation and Start

```
npm start
```

installs local dependencies, clears build, sets file watchers, starts server

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

##### How to get server environment variables

1. use a gmail address as a value for variable `MAILER_EMAIL`;
2. `creation of creadentials is optional if you already did it earlier`: being authenticated under gmail address from `step 1` create creadentials via [google developers console](https://console.developers.google.com/apis/credentials), choose `OAuth client ID` when selecting credentials type, use `Client ID` as a value for `MAILER_CLIENT_ID` environment variable;
3. use `Client Secret` value from created creadentials as a `MAILER_CLIENT_SECRET` variable value;
4. to get `MAILER_REFRESH_TOKEN` value do the following:
  * go to [googleoauth 2.0 playground](https://developers.google.com/oauthplayground);
  * hit cog `settings` button to the right;
  * check `Use your own credentials`, and fill in `OAuth Client ID`, and `OAuth Client secret`, which were obtained in the previous steps;
  * `Step 1: Select & authorize APIs`: scroll down to `Gmail API v1`, expand it, select `https://mail.google.com`;
  * `Step 2: Exchange authorization code for tokens`: hit `Exchange authorization code for tokens`, and use `Refresh token` value as a `MAILER_REFRESH_TOKEN`;
  * that's all, assign `MAILER_ACCESS_TOKEN` value `empty` like `MAILER_ACCESS_TOKEN=empty`.

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

* [`Dnbhub`](LICENSE)
