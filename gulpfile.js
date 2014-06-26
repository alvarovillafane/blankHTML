//npm install --save-dev gulp-xxxxxxx

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-minify-html');

var env,
	sassSources,
	jsSources,
	htmlSources,
	sassStyle,
	outputDir;

//In Console: set NODE_ENV = production/development
env = process.env.NODE_ENV || "development";

if( env == "development"){
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compress';
}

jsSources = ['components/scripts/custom.js', 'components/scripts/free-modern.js'];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
imgSources = ['builds/development/images/*'];


gulp.task('jsScripts', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(gulpif(env == 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
    	sass: 'components/sass',
    	image: outputDir + 'images',
    	style: sassStyle

    }))
    .on('error',gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});


gulp.task('html', function(){
	gulp.src('builds/development/*.html')
	.pipe(connect.reload())
	//.pipe( gulpif(env == 'production', minifyHtml()) )
	.pipe( gulpif(env == 'production', gulp.dest(outputDir)) )
});

gulp.task('img', function(){
	gulp.src(imgSources)
	.on('error',gutil.log)
	.pipe( gulpif(env == 'production', gulp.dest(outputDir + 'images')) )
});


gulp.task('watch', function(){
	gulp.watch(jsSources, ['jsScripts']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(imgSources,['img'])
});

gulp.task('connect', function(){
	connect.server({
	    root: 'builds/development',
	    livereload: true
  	});
});

gulp.task('default', ['html','img','jsScripts','compass','connect','watch']);
