"use strict";

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const del = require("del");
const replace = require("gulp-replace");
const injectPartials = require("gulp-inject-partials");
const inject = require("gulp-inject");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const merge = require("merge-stream");
const minifyCSS = require("gulp-clean-css");

gulp.paths = {
  dist: "dist",
};

const paths = gulp.paths;

const moveFonts = () => {
  return gulp.src('./fonts/GE_SS_Two/*.otf', { allowEmpty: true })
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(browserSync.stream());
}

gulp.task("sass", function () {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task(
  "serve",
  gulp.series("sass", function () {
    browserSync.init({
      port: 3100,
      server: "./",
      ghostMode: false,
      notify: false,
    });

    gulp.watch("scss/**/*.scss", gulp.series("sass"));
    gulp.watch("**/*.html").on("change", browserSync.reload);
    gulp.watch("js/**/*.js").on("change", browserSync.reload);
  })
);

// Static Server without watching scss files
gulp.task("serve:lite", function () {
  browserSync.init({
    server: "./",
    ghostMode: false,
    notify: false,
  });

  gulp.watch("**/*.css").on("change", browserSync.reload);
  gulp.watch("**/*.html").on("change", browserSync.reload);
  gulp.watch("js/**/*.js").on("change", browserSync.reload);
});

gulp.task("sass:watch", function () {
  gulp.watch("./scss/**/*.scss");
});

/* inject partials like sidebar and navbar */
gulp.task("injectPartial", function () {
  var injPartial1 = gulp
    .src("./pages/**/*.html", { base: "./" })
    .pipe(injectPartials())
    .pipe(gulp.dest("."));
  var injPartial2 = gulp
    .src("./*.html", { base: "./" })
    .pipe(injectPartials())
    .pipe(gulp.dest("."));
  return merge(injPartial1, injPartial2);
});

/* inject Js and CCS assets into HTML */
gulp.task("injectCommonAssets", function () {
  return gulp
    .src("./**/*.html")
    .pipe(
      inject(
        gulp.src(
          [
            "./vendors/mdi/css/materialdesignicons.min.css",
            "./vendors/base/vendor.bundle.base.css",
            "./vendors/base/vendor.bundle.base.js",
          ],
          { read: false }
        ),
        { name: "plugins", relative: true }
      )
    )
    .pipe(
      inject(
        gulp.src(
          [
            "./css/*.css",
            "./js/off-canvas.js",
            "./js/hoverable-collapse.js",
            "./js/template.js",
          ],
          { read: false }
        ),
        { relative: true }
      )
    )
    .pipe(gulp.dest("."));
});

/* inject Js and CCS assets into HTML */
gulp.task("injectLayoutStyles", function () {
  return gulp
    .src("./**/*.html")
    .pipe(
      inject(gulp.src(["./css/style.css"], { read: false }), { relative: true })
    )
    .pipe(gulp.dest("./dist"));
});

/*replace image path and linking after injection*/
gulp.task("replacePath", function () {
  var replacePath1 = gulp
    .src(["./pages/*/*.html"], { base: "./" })
    .pipe(replace('="images/', '="../../images/'))
    .pipe(replace('href="pages/', 'href="../../pages/'))
    .pipe(replace('href="documentation/', 'href="../../documentation/'))
    .pipe(replace('href="index.html"', 'href="../../index.html"'))
    .pipe(gulp.dest("."));
  var replacePath2 = gulp
    .src(["./pages/*.html"], { base: "./" })
    .pipe(replace('="images/', '="../images/'))
    .pipe(replace('"pages/', '"../pages/'))
    .pipe(replace('href="index.html"', 'href="../index.html"'))
    .pipe(gulp.dest("."));
  var replacePath3 = gulp
    .src(["./index.html"], { base: "./" })
    .pipe(replace('="images/', '="images/'))
    .pipe(gulp.dest("."));
  return merge(replacePath1, replacePath2, replacePath3);
});

/*sequence for injecting partials and replacing paths*/
gulp.task(
  "inject",
  gulp.series(
    "injectPartial",
    "injectCommonAssets",
    "injectLayoutStyles",
    "replacePath"
  )
);

gulp.task("clean:vendors", function () {
  return del(["vendors/**/*"]);
});

/*Building vendor scripts needed for basic template rendering*/
gulp.task("buildBaseVendorScripts", function () {
  return gulp
    .src([
      "./node_modules/jquery/dist/jquery.min.js",
      // './node_modules/popper.js/dist/umd/popper.min.js',
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
      "./node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js",
    ])
    .pipe(concat("vendor.bundle.base.js"))
    .pipe(gulp.dest("./vendors/base"));
});

/*Building vendor styles needed for basic template rendering*/
gulp.task("buildBaseVendorStyles", function () {
  return gulp
    .src(["./node_modules/perfect-scrollbar/css/perfect-scrollbar.css"])
    .pipe(concat("vendor.bundle.base.css"))
    .pipe(minifyCSS())
    .pipe(gulp.dest("./vendors/base"));
});

//Copy essential map files
gulp.task("copyMapFiles", function () {
  var map1 = gulp
    .src("node_modules/bootstrap/dist/js/bootstrap.min.js.map")
    .pipe(gulp.dest("./vendors/base"));
  var map2 = gulp
    .src("node_modules/@mdi/font/css/materialdesignicons.min.css.map")
    .pipe(gulp.dest("./vendors/mdi/css"));
  return merge(map1, map2);
});

/*sequence for building vendor scripts and styles*/
gulp.task(
  moveFonts,
  gulp.series(
    "clean:vendors",
    "buildBaseVendorStyles",
    "buildBaseVendorScripts",
    "copyMapFiles"
  )
);

gulp.task("default", gulp.series(moveFonts, "serve"));
