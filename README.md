# Drum'n'Bass Hub

[See it in action](http://dnbhub.com)

### Environment variables

these are required and used by a `gulp` task `pack-app-js`

```
SOUNDCLOUD_CLIENT_ID=soundcloud_client_id
FIREBASE_API_KEY=firebase_api_key
FIREBASE_AUTH_DOMAIN=firebase_auth_domain
FIREBASE_DATABASE_URL=firebase_database_url
FIREBASE_PROJECT_ID=firebase_project_id
FIREBASE_STORAGE_BUCKET=firebase_storeage_bucket
FIREBASE_MESSAGING_SENDER_ID=firebase_messaging_sender_id
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

if built project is hosted on a webserver without NodeJS support, the following should be added to `./htaccess` for Angular routing to work properly:

```
RewriteEngine on
Options FollowSymLinks
ReqriteBase /
ReqriteCond %{REQUEST_FILENAME} !-f
ReqriteCond %{REQUEST_FILENAME} !-d
ReqriteRule ^(.*)$ /#/$1 [L]
```
