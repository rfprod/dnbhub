'use strict';

const gulp = require('gulp'),
	runSequence = require('run-sequence'),
	util = require('gulp-util'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	eslint = require('gulp-eslint'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	mocha = require('gulp-mocha'),
	karmaServer = require('karma').Server,
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	gulpFilter = require('gulp-filter'),
	mainBowerFiles = require('main-bower-files'),
	del = require('del'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;
let node, mongo,
	protractor;

function killProcessByName(name) {
	exec('ps -e | grep ' + name, (error, stdout, stderr) => {
		if (error) throw error;
		if (stderr) console.log('stderr: ',stderr);
		if (stdout) {
			//console.log('killing running processes: ', stdout);
			var runningProcessesIDs = stdout.match(/\d{4}/);
			runningProcessesIDs.forEach((id) => {
				exec('kill -9 ' + id, (error, stdout, stderr) => {
					if (error) throw error;
					if (stderr) console.log('stdout:', stdout);
					if (stdout) console.log('stderr:', stderr);
				});
			});
		}
	});
}

gulp.task('database', () => {
	if (mongo) mongo.kill();
	mongo = spawn('mongod', ['--smallfiles'], {stdio: 'inherit'});
	mongo.on('close', (code) => {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
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

gulp.task('server-test', () => {
	return gulp.src(['./test/server/*.js'], { read: false })
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', util.log);
});

gulp.task('client-unit-test', (done) => {
	new karmaServer({
		configFile: require('path').resolve('test/karma.conf.js'),
		singleRun: true
	}, () => {
		console.log('done');
		done();
	}).start();
});

gulp.task('client-e2e-test', () => {
	if (protractor) protractor.kill();
	protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
});

gulp.task('concat-and-uglify-js', () => {
	return gulp.src('./public/app/*.js')
		.pipe(plumber())
		.pipe(concat('packed-app.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('sass-autoprefix-minify-css', () => {
	return gulp.src('./public/app/scss/*.scss')
		.pipe(plumber())
		.pipe(concat('packe-app.css'))
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('bower-files', () => {
	const filterJS = gulpFilter('**/*.js', { restore: true });
	return gulp.src(mainBowerFiles(
		{
			paths: {
				bowerJson: './bower.json',
				bowerrc: './.bowerrc'
			}
		}))
		.pipe(filterJS)
		.pipe(plumber())
		.pipe(concat('vendor-pack.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.js'))
		.pipe(filterJS.restore)
		.pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-css', () => { // packs vendor css files which bowerFiles put into public/js folder on bower-files task execution
	return gulp.src('./public/js/*.css')
		.pipe(plumber())
		.pipe(concat('vendor-pack.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('move-vendor-fonts', () => { // move vendor font files which bowerFiles put into public/fonts folder on bower-files task execution
	return gulp.src(['./public/js/*.otf', './public/js/*.eot', './public/js/*.svg', './public/js/*.ttf', './public/js/*.woff', './public/js/*.woff2'])
		.pipe(gulp.dest('./public/fonts'));
});

gulp.task('build-clean', () => { // remove vendor css and fonts from public/js
	return del(['./public/js/*.css', './public/js/*.otf', './public/js/*.eot', './public/js/*.svg', './public/js/*.ttf', './public/js/*.woff', './public/js/*.woff2']);
});

gulp.task('lint', () => { // uses ignore list from .eslintignore
	return gulp.src(['./public/app/**', './*.js'])
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('watch-and-lint', () => {
	gulp.watch(['./public/*.js', './public/app/components/**', './public/app/views/**', './*.js', './.eslintignore', './.eslintrc.json'], ['lint']); // watch files to be linted or eslint config files and lint on change
});

gulp.task('watch', () => {
	gulp.watch(['./server.js', './app/**/*.js'], ['server']); // watch server and database changes and restart server
	gulp.watch(['./server.js', './app/models/*.js'], ['database']); // watch database changes and restart databse
	gulp.watch(['./public/*.js', './public/app/**/*.js', './*.js', './.eslintignore', './.eslintrc.json'], ['lint']); // watch files to be linted or eslint config files and lint on change
	gulp.watch('./public/app/**/*.js', ['concat-and-uglify-js']); // watch app js changes, pack js, minify and put in respective folder
	gulp.watch('./public/app/scss/*.scss', ['sass-autoprefix-minify-css']); // watch app css changes, pack css, minify and put in respective folder
	gulp.watch(['./public/app/*.js','./test/client/unit/*.js','./test/karma.conf.js'], ['client-unit-test']); //watch unit test changes and run tests
	gulp.watch(['./test/client/e2e/**', './test/protractor.conf.js'], ['server-test']); // watch server changes and run tests
	gulp.watch(['./server.js', './test/server/test.js'], ['server-test']); // watch server changes and run tests
});

gulp.task('build', (done) => {
	runSequence('lint', 'concat-and-uglify-js', 'sass-autoprefix-minify-css', 'bower-files', 'pack-vendor-css', 'move-vendor-fonts', 'build-clean', 'client-unit-test', done);
});

gulp.task('default', ['build', 'database','server','watch','client-e2e-test']);

process.on('exit', function() {
	if (node) node.kill();
	if (mongo) mongo.kill();
});

process.on('SIGINT', function() {
	killProcessByName('gulp');
});
