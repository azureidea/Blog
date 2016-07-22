"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');

gulp.task('sass:compile',function(){
	return gulp.src('./public/admin/styles/sass/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('./public/admin/styles/'))
});

gulp.task('watch',function(){
	gulp.watch('./public/admin/styles/sass/*.scss',['sass:compile'])
});

gulp.task('default',['sass:compile']);