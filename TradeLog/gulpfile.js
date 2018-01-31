//https://github.com/enric11/OpenUI5compiler/blob/master/WebContent/gulpfile.js
/*
npm install gulp-replace
npm install gulp-uglify
npm install gulp-ui5-preload
npm install gulp-minify
npm install gulp-pretty-data
npm install gulp-if
npm install gulp
npm install del
npm install gulp-replace
npm install gulp-rimraf
var gulps = require("gulp-series");
var prettify = require('gulp-prettify');
*/
var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
rm = require('gulp-rimraf');
var gulps = require("gulp-series");
var prettify = require('gulp-prettify');

var your_project = 'tradelog';


gulp.task('build', ['copiaConteudoWeb']);

//gulp.task('default', function () {
//    gulp.watch('app/**/*', ['build']);
//});

gulp.task('default', ['1compres','2ui5preloadCompresed','3prepareComponentPreload','4deleteCleanDist']);

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

gulp.task(
    'ui5preload',
    function () {
        return gulp.src(
            [
                './**/**.+(js|xml)',
                '!Component-preload.js',
                '!gulpfile.js',
                '!WEB-INF/web.xml',
                '!model/metadata.xml',
                '!node_modules/**',
                '!resources/**'
            ]
        )
            .pipe(gulpif('./**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: './',
                namespace: your_project,
                fileName: 'Component-preload.js'

            }))
            .pipe(gulp.dest('.'));
    }
);

gulp.task('1compres', function () {
    return gulp.src(
        [
            './**/**.+(js|xml)',
            '!Component-preload.js',
            '!gulpfile.js',
            '!distTmp/',
            '!WEB-INF/web.xml',
            '!model/metadata.xml',
            '!node_modules/**',
            '!resources/**'
        ]
    )
        .pipe(minify({
            ext: {
                src: '.dbg.js',
                min: '.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('./distTmp'));
});

gulp.task(
    '2ui5preloadCompresed', ['1compres'],
    function () {
        return gulp.src(
            [
                'distTmp/**/**.+(js|xml)',
                '!distTmp/**/**.dbg.+(js|xml)',
                '!Component-preload.js',
                '!gulpfile.js',
                '!WEB-INF/web.xml',
                '!model/metadata.xml',
                '!node_modules/**',
                '!resources/**'
            ]
        )
            .pipe(gulpif('./**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: './',
                namespace: your_project,
                fileName: 'Component-preload.js'

            }))
            .pipe(gulp.dest('./'));
    }
);

gulp.task('3prepareComponentPreload', ['2ui5preloadCompresed'], function () {
    return gulp.src(['Component-preload.js'])
        .pipe(replace('/distTmp/', '/'))
        .pipe(replace("http://localhost:58761/odata/", 'http://tradelog.me/servico/odata/'))
        .pipe(gulp.dest('.'));

});

gulp.task('4deleteCleanDist', ['3prepareComponentPreload'], function () {
    return del('./distTmp', { force: true });
});



