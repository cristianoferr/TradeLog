//https://github.com/enric11/OpenUI5compiler/blob/master/app/gulpfile.js
/*
npm install gulp-replace
npm install gulp-uglify
npm install gulp-ui5-preload
npm install gulp-minify
npm install gulp-pretty-data
npm install gulp-if
npm install gulp
npm install del
npm install gulp-series
npm install gulp-prettify
npm install gulp-rimraf
*/
var gulp = require('gulp');
var del = require('del');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
rm = require('gulp-rimraf');

var gulps = require("gulp-series");
var prettify = require('gulp-prettify');

var your_project = 'tradelog';


gulp.task('build', ['copiaConteudoWeb']);

//gulp.task('default', function () {
//    gulp.watch('app/**/*', ['build']);
//});

gulp.task('default', ['clean', '1compres', '2ui5preloadCompresed', '3prepareComponentPreload']);

gulp.task('copiaConteudoWeb', function () {
    del(['build/**/*']).then(function (erro) {
        gulp.src(['app/**/*'])
            .pipe(replace("http://localhost:58761/odata/", 'http://tradelog.me/servico/odata/'))
            .pipe(gulp.dest('build'));
    });
});

gulp.task('cordovaPrepare', function () {
    setTimeout(function () {
        var exec = require('child_process').exec;
        exec('cordova prepare', function (erro, stdout, stderr) {
            if (erro) console.log(erro);
            if (stdout) console.log(stdout);
            if (stderr) console.log(stderr);
        });
    }, 3000);
});

//Funciona mas gera um arquivo de quase 2 megas
gulp.task(
    'ui5preload',
    function () {
        return gulp.src(
            [
                'app/**/**.+(js|xml)',
                '!Component-preload.js',
                '!app/Component-preload.js',
                '!gulpfile.js',
                '!WEB-INF/web.xml',
                '!model/metadata.xml',
                '!node_modules/**'
            ]
        )
            .pipe(gulpif('./**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: 'app/',
                namespace: your_project,
                fileName: 'app/Component-preload.js'

            }))
            .pipe(gulp.dest('.'));
    }
);

//gera arquivos .min.js na pasta build
gulp.task('1compres', function () {
    return gulp.src(
        [
            'app/**/**.+(js|xml)',
            '!Component-preload.js',
            '!app/Component-preload.js',
            '!gulpfile.js',
            '!WEB-INF/web.xml',
            '!model/metadata.xml'
        ]
    )
        .pipe(minify({
            exclude: ['tasks'],
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('./build'));
});


//Gera o arquivo component-preload.js a partir da pasta build
gulp.task(
    '2ui5preloadCompresed', ['1compres'],
    function () {
        return gulp.src(
            [
                'build/**/**.+(*-min.js)',
                'build/**/**+(*-min.js)',
                'build/**/**.+(min.js)',
                'build/**/**.+(xml)',
                'build/**.+(xml)',
                '!build/**/**.dbg.+(js|xml)'
            ]
        )
            //.pipe(gulpif('build/**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: 'app/',
                namespace: your_project,
                fileName: 'app/Component-preload.js'

            }))
            .pipe(gulp.dest('./'));
    }
);

//substitui caminhos invalidos
gulp.task('3prepareComponentPreload', ['2ui5preloadCompresed'], function () {
    return gulp.src(['app/Component-preload.js'])
        .pipe(replace('../build/', ''))
        .pipe(replace('-min.js":', '.js":'))
        .pipe(gulp.dest('app'));

});

gulp.task('4deleteCleanDist', ['3prepareComponentPreload'], function () {
    return del('./build', { force: true });
});

gulp.task('clean', function () {
    return del('./build', { force: true });
});



