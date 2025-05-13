const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');

// Configurações
const paths = {
    styles: {
        src: 'styles/**/*.scss',
        dest: 'static/css'
    },
    scripts: {
        src: 'scripts/**/*.js',
        dest: 'static/js'
    },
    images: {
        src: 'images/**/*',
        dest: 'static/images'
    },
    html: './*.html'
};

// Compila SCSS para CSS, aplica autoprefixer, gera sourcemaps
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed', quietDeps: true }).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Concatena e minifica arquivos JS
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Otimiza imagens
function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
}

// Limpa os diretórios de build
function clean() {
    return del(['static/css', 'static/js', 'static/images']);
}

// Inicia servidor local e observa mudanças
function watch() {
    browserSync.init({
        server: { baseDir: './' }
    });

    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.html).on('change', browserSync.reload);
}

// Exporta as tarefas
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.default = gulp.series(
    clean,
    gulp.parallel(styles, scripts, images),
    watch
);
