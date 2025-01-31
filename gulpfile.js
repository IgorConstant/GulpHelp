const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// Compile Sass
function styles() {
    return gulp
        .src('styles/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            quietDeps: true // Isso só remove warnings relacionados a dependências do Sass
        }).on('error', sass.logError)) // Adicione para evitar quebra por erros no Sass
        .pipe(gulp.dest('static/css'))
        .pipe(browserSync.stream());
}

// Concatenate & Minify JS
function scripts() {
    return gulp.src([
        '', // Insira os arquivos de extensão JS aqui
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('static/js')) // Aqui você pode ajustar o diretorio que irá salvar o arquivo comprimido
        .pipe(browserSync.stream());
}

// Watch files
function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('styles/*.scss', styles);
    gulp.watch('scripts/*.js', scripts);
    gulp.watch('*.html').on('change', browserSync.reload); // Recarrega quando HTML muda
}

// Tasks
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('default', gulp.parallel('styles', 'scripts', 'watch'));
