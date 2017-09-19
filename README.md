# Drum'n'Bass Hub

[See it in action](http://dnbhub.com)

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
