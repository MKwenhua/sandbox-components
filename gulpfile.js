var gulp = require('gulp');
var fs = require("fs");
var browserify = require("browserify");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var sync = require('run-sequence');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var stripCssComments = require('gulp-strip-css-comments');



gulp.task('scripts', function () {
   return gulp.src([
        'public/build/bundle.min.js'
      ])
      .pipe(concat('bundle.ugly.js'))
      .pipe(uglify())
      .pipe(gulp.dest('public/build'));

});
gulp.task('globals', function () {
   return gulp.src([
        'node_modules/d3/build/d3.min.js',
        'public/build/bundle.min.js'
      ])
      .pipe(concat('all.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('public/dist'));

});

gulp.task('css', function () {
   return gulp.src([
         'node_modules/bootstrap-grid/dist/grid.min.css',
         'public/css/body.css',
     		 'public/css/buttons.css',
     		 'public/css/headlines.css',
         'public/css/loader2.css',
         'public/css/loading2.css',
         'public/css/alignment.css',
         'public/css/custominputs.css',
         'public/css/animations.css',
         'public/css/movingparts.css',
         'public/css/popups.css',
         'public/css/draggable.css',
         'public/css/dropzone.css',
         'public/css/li.css',
         'public/css/charts.css',
         'public/css/formstyles.css',
         'public/css/newstyles.css',
         'public/css/ani_elements.css',
         'public/css/tabs.css',
         'public/css/listcomponent.css',
         'public/css/media_queries.css'
      ])
      //.pipe(sourcemaps.init())
      .pipe(stripCssComments())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      .pipe(concat('app.min.css'))
      .pipe(gulp.dest('public/dist'))
});


gulp.task('transpile', function() {
	return browserify("./public/dist/app.js")
  .transform("babelify", {presets: ["es2015", "react"]})
  .bundle()
  .pipe(fs.createWriteStream("./public/bundle.js"));

});
gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});
gulp.task('default', function (done) {
		sync(  'scripts','css' ,done); 

});
gulp.task('addheader', function(done){
	sync('globals', 'css', done);
});
gulp.task('production',  function (done) {
		sync( 'apply-prod-environment', 'scripts','css' ,done); 

});
