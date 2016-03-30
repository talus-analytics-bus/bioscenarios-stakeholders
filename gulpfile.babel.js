const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

gulp.task('default', ['minify-js']);

gulp.task('minify-js', () => {
	gulp.src([
		'./js/!(app)*.js',
		'./js/pages/*.js',
		'./js/app.js',
	])
		.pipe(concat('bundle.js'))
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build'));
});

gulp.task('minify-css', () => {
	gulp.src([
		'./css/bootstrap.min.css',
		'./css/!(main)*.css',
		'./css/main.css',
	])
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest('build'));
});

gulp.task('minify-lib', () => {
	gulp.src([
		'lib/jquery-2.2.0.min.js',
		'lib/signals.min.js',
		'lib/*.js',
	])
		.pipe(concat('lib.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('build'));
});
