'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const tslint = require('gulp-tslint');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const mocha = require('gulp-mocha');
const karmaServer = require('karma').Server;
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const systemjsBuilder = require('gulp-systemjs-builder');
const hashsum = require('gulp-hashsum');
const crypto = require('crypto');
const fs = require('fs');
const spawn = require('child_process').spawn;

let node;
let tsc;
let protractor;

/*
*	hashsum identifies build
*
*	after build SHA1SUMS.json is generated with sha1 sums for different files
*	then sha256 is calculated using stringified file contents
*/
gulp.task('hashsum', () => {
  return gulp.src(['./public/*', '!./public/SHA1SUMS.json', './public/app/views/**', './public/css/**', './public/webfonts/**', './public/img/**', './public/js/**'])
    .pipe(hashsum({ filename: 'public/SHA1SUMS.json', hash: 'sha1', json: true }));
});

gulp.task('set-build-hash', (done) => {
  fs.readFile('./public/SHA1SUMS.json', (err, data) => {
    if (err) throw err;
    const hash = crypto.createHmac('sha256', data.toString()).digest('hex');
    console.log('BUILD_HASH', hash);
    fs.writeFile('./public/hashsum.json', `{ "hashsum": "${hash}" }`, (err) => {
      if (err) throw err;
      console.log('# > hashsum.json was updated');
      done();
    });
  });
});

gulp.task('server', () => {
  if (node) node.kill();
  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('server-kill', (done) => {
  if (node) node.kill();
  done();
});

gulp.task('tsc', (done) => {
  if (tsc) tsc.kill();
  tsc = spawn('tsc', [], {stdio: 'inherit'});
  tsc.on('close', (code) => {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    } else {
      done();
    }
  });
});

/*
* Documentation
*/

const logsIndexHTML = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        height: 100%;
        margin: 0;
        padding: 0 1em;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        justify-content: stretch;
      }
      .flex-100 {
        flex: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .flex-item {
        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        border: 1px rgba(0, 0, 0, 0.3) dotted;
      }
      a {
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <h1 class="flex-100">DNBHUB Reports and Documentation Index</h1>

    <h2 class="flex-100">Reports</h2>

      <span class="flex-item">
        <h3 class="flex-100">Client Unit</h3>
        <a class="flex-item" href="unit/client/index.html" target=_blank>Spec</a>
        <a class="flex-item" href="coverage/html-report/index.html" target=_blank>Coverage</a>
      </span>

      <span class="flex-item">
        <h3 class="flex-100">Client E2E</h3>
        <a class="flex-item" href="e2e/report/index.html" target=_blank>Spec</a>
      </span>

      <h2 class="flex-100">Documentation</h2>

      <span class="flex-item">
        <h3 class="flex-100">JsDoc</h3>
        <a class="flex-item" href="jsdoc/index.html" target=_blank>JsDoc</a>
      </span>

      <span class="flex-item">
        <h3 class="flex-100">TypeDoc</h3>
        <a class="flex-item" href="typedoc/index.html" target=_blank>TypeDoc</a>
      </span>
  </body>
</html>
`;
gulp.task('generate-logs-index', (done) => {
  fs.writeFile('./logs/index.html', logsIndexHTML, (err) => {
    if (err) throw err;
    console.log('# > LOGS index.html > was created');
    done();
  });
});

gulp.task('jsdoc', () => {
  const jsdoc = require('gulp-jsdoc3');
  const config = require('./jsdoc.json');
  const source = ['./server.js', './gulpfile.js', './public/app/service-worker.js', './test/*.js', './systemjs*.js'];
  return gulp.src(['README.md'].concat(source), {read: false})
    .pipe(jsdoc(config));
});

gulp.task('typedoc', () => {
  const typedoc = require('gulp-typedoc');
  const config = {
    // typescript options (see typescript docs)
    allowSyntheticDefaultImports: true,
    alwaysStrict: true,
    importHelpers: true,
    emitDecoratorMetadata: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    module: 'commonjs',
    moduleResolution: 'node',
    noImplicitAny: false,
    removeComments: true,
    sourceMap: true,
    suppressImplicitAnyIndexErrors: true,
    target: 'es2017',
    // output options (see typedoc docs: http://typedoc.org/api/index.html)
    readme: './README.md',
    out: './logs/typedoc',
    json: './logs/typedoc/typedoc-output.json',
    // typedoc options (see typedoc docs: http://typedoc.org/api/index.html)
    name: 'DNBHUB Client',
    theme: 'default',
    //plugins: [], // set to none to use no plugins, omit to use all
    includeDeclarations: false,
    ignoreCompilerErrors: true,
    version: true
  };
  return gulp.src(['./public/app/**/*.ts'], {read: false})
    .pipe(typedoc(config));
});

/*
* Testing
*/

gulp.task('server-test', () => {
  return gulp.src(['./test/server/*.js'], { read: false })
    .pipe(mocha({ reporter: 'nyan' }))
    .on('error', (error) => console.log('Server test error', error));
});

let karmaSRV;
gulp.task('client-unit-test', (done) => {
  if (!karmaSRV) {
    karmaSRV = new karmaServer({
      configFile: require('path').resolve('test/karma.conf.js'),
      singleRun: true
    });

    karmaSRV.on('browser_error', (browser, err) => {
      console.log('=====\nKarma > Run Failed\n=====\n', err);
      throw err;
    });

    karmaSRV.on('run_complete', (browsers, results) => {
      if (results.failed) {
        // throw new Error('=====\nKarma > Tests Failed\n=====\n', results);
        console.log('=====\nKarma > Tests Failed\n=====\n', results);
      } else {
        console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
      }

      done();
    });

    karmaSRV.start();
  } else {
    console.log('<<<<< karmaSRV already running >>>>>');
  }
});

gulp.task('client-e2e-test', () => {
  if (protractor) protractor.kill();
  protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
});

gulp.task('build-system-js', () => {
  /*
  *	this task builds angular application
  *	components, angular modules, and some dependencies
  */
  require('dotenv').load();
  const env = process.env;
  return systemjsBuilder('/','./systemjs.config.js')
    .buildStatic('app', 'packed-app.min.js', {
      minify: true,
      mangle: true
    })
    .pipe(replace('soundcloud_client_id', env.SOUNDCLOUD_CLIENT_ID))
    .pipe(replace('firebase_api_key', env.FIREBASE_API_KEY))
    .pipe(replace('firebase_auth_domain', env.FIREBASE_AUTH_DOMAIN))
    .pipe(replace('firebase_database_url', env.FIREBASE_DATABASE_URL))
    .pipe(replace('firebase_project_id', env.FIREBASE_PROJECT_ID))
    .pipe(replace('firebase_storage_bucket', env.FIREBASE_STORAGE_BUCKET))
    .pipe(replace('firebase_messaging_sender_id', env.FIREBASE_MESSAGING_SENDER_ID))
    .pipe(replace('privileged_access_firebase_uid', env.PRIVILEGED_ACCESS_FIREBASE_UID))
    .pipe(replace('google_apis_browser_key', env.GOOGLE_APIS_BROWSER_KEY))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-js', () => {
  return gulp.src([
    /*
    *	add third party js files here
    */
    // angular requirements
    './node_modules/core-js/client/shim.js',
    './node_modules/zone.js/dist/zone.min.js',
    './node_modules/reflect-metadata/Reflect.js',
    './node_modules/web-animations-js/web-animations.min.js'
  ])
    .pipe(plumber())
    .pipe(concat('vendor-pack.js'))
    .pipe(uglify())
    .pipe(plumber.stop())
    .pipe(rename('vendor-pack.min.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-css', () => {
  return gulp.src([
    /*
    *	add third party css files here
    */
    './node_modules/components-font-awesome/css/fontawesome-all.css',
    /*
    *	Angular material theme should be chosen and loaded here
    */
    //'./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css'
    //'./node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
    //'./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css'
    //'./node_modules/@angular/material/prebuilt-themes/purple-green.css'
  ])
    .pipe(plumber())
    .pipe(concat('vendor-pack.css'))
    .pipe(cssnano())
    .pipe(plumber.stop())
    .pipe(rename('vendor-pack.min.css'))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('move-vendor-fonts', () => {
  return gulp.src([
    /*
    *	add third party fonts here
    */
    './node_modules/components-font-awesome/webfonts/*.*',
    // material design icons
    './node_modules/material-design-icon-fonts/iconfont/*.eot',
    './node_modules/material-design-icon-fonts/iconfont/*.woff2',
    './node_modules/material-design-icon-fonts/iconfont/*.woff',
    './node_modules/material-design-icon-fonts/iconfont/*.ttf'
  ])
    .pipe(gulp.dest('./public/webfonts'));
});

gulp.task('sass-autoprefix-minify-css', () => {
  return gulp.src('./public/app/scss/*.scss')
    .pipe(plumber())
    .pipe(concat('packed-app.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(plumber.stop())
    .pipe(rename('packed-app.min.css'))
    .pipe(gulp.dest('./public/css'));
});

/*
* Lint
*/

gulp.task('eslint', () => {
  return gulp.src(['./*.js', './functinons/*.js', './app/service-worker.js', './test/*.js', './test/e2e/scenarios.js', './test/server/test.js']) // uses ignore list from .eslintignore
    .pipe(eslint('./.eslintrc.json'))
    .pipe(eslint.format());
});

gulp.task('tslint', () => {
  return gulp.src(['./public/app/*.ts', './public/app/**/*.ts', '!./public/app/{scss,views}/', './test/client/**/*.ts'])
    .pipe(tslint({
      formatter: 'verbose' // 'verbose' - extended info | 'prose' - brief info
    }))
    .pipe(tslint.report({
      emitError: false
    }));
});

gulp.task('lint', (done) => {
  runSequence('eslint', 'tslint', done);
});

/*
* Watch
*/

gulp.task('watch', () => {
  gulp.watch(['./server.js', './app/**/*.js'], ['server']); // watch server and database changes, and restart server
  gulp.watch(['./test/server/*.js'], ['server-test']); // watch server tests changes, and run tests
  gulp.watch(['./gulpfile.js'], ['pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts']); // watch gulpfile changes, and repack vendor assets
  gulp.watch('./public/app/scss/*.scss', ['sass-autoprefix-minify-css']); // watch app scss-source changes, and pack application css bundle
  gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts', './tslint.json'], ['spawn-rebuild-app']); // watch app ts-source chages, and rebuild app js bundle
  gulp.watch(['./*.js', './app/**/*.js', './test/*.js', './test/client/e2e/scenarios.js', './test/server/test.js', './.eslintignore', './.eslintrc.json'], ['eslint']); // watch js file changes, and lint
});

/*
*	Test
*/

gulp.task('compile-and-test', (done) => {
  runSequence('tsc', 'client-unit-test', done);
});

/*
*	Build
*/

gulp.task('compile-and-build', (done) => {
  runSequence('tsc', 'build-system-js', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', 'hashsum', 'set-build-hash', done);
});

gulp.task('build', (done) => {
  runSequence('build-system-js', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', 'hashsum', 'set-build-hash', done);
});

gulp.task('rebuild-app', (done) => { // should be used in watcher to rebuild the app on *.ts file changes
  runSequence('tslint', 'tsc', 'build-system-js', 'hashsum', 'set-build-hash', done);
});

let rebuildApp;
gulp.task('spawn-rebuild-app', (done) => {
  if (rebuildApp) rebuildApp.kill();
  rebuildApp = spawn('gulp', ['rebuild-app'], {stdio: 'inherit'});
  rebuildApp.on('close', (code) => {
    console.log(`rebuildApp closed with code ${code}`);
  });
  done();
});

/*
* Start
*/

gulp.task('default', (done) => {
  runSequence('lint', 'compile-and-build', 'server', 'watch', done);
});

/*
* Version
*/

gulp.task('bump-version-patch', () => {
  const version = require('gulp-bump');
  return gulp.src(['./package.json'])
    .pipe(version({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-version-minor', () => {
  const version = require('gulp-bump');
  return gulp.src(['./package.json'])
    .pipe(version({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-version-major', () => {
  const version = require('gulp-bump');
  return gulp.src(['./package.json'])
    .pipe(version({type: 'major'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-version-prerelease', () => {
  const version = require('gulp-bump');
  return gulp.src(['./package.json'])
    .pipe(version({type: 'prerelease'}))
    .pipe(gulp.dest('./'));
});

process.on('exit', function(code) {
  console.log(`PROCESS EXIT CODE ${code}`);
});
