import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import del from 'del';
import browsersync from 'browser-sync';

let path = {
    dist: {
        html: './dist/',
        css: './dist/css/',
        js: './dist/js/',
        img: './dist/img/',
        fonts: './dist/fonts/',
    },
    src: {
        html: './src/*.html',
        style: './src/sass/**/*.scss',
        js: './src/js/*.js',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*',
    },
    watch: {
        html: './src/**/*.html',
        style: './src/sass/**/**/*.scss',
        js: './src/js/**/*.js',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*',
    }
};

const clean = () => {
    return del('dist');
};

const html = () => {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.dist.html))
        .pipe(browsersync.stream());
}

const styles = () => {
    return gulp.src('./src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cssnano())
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(browsersync.stream());
}

const scripts = () => {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.js))
        .pipe(browsersync.stream());
}

const images = () => {
    return gulp.src(path.src.img)
        .pipe(imagemin(
            [
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(gulp.dest(path.dist.img))
        .pipe(browsersync.stream());
}

const fonts = () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
        .pipe(browsersync.stream());
}

const browserSync = (done) => {
    browsersync.init({
        server: {
            baseDir: './dist'
        }
    });
    done();
}

const watchFiles = () => {
    gulp.watch(path.src.fonts, gulp.series(fonts));
    gulp.watch(path.src.style, gulp.series(styles));
    gulp.watch(path.src.js, gulp.series(scripts));
    gulp.watch(path.src.img, gulp.series(images));
    gulp.watch(path.src.html, gulp.series(html));
}

export default gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts), gulp.parallel(watchFiles, browserSync));