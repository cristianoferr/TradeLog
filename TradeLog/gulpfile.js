//https://github.com/enric11/OpenUI5compiler/blob/master/app/gulpfile.js
/*
npm install gulp-replace
npm install gulp-uglify
npm install gulp-ui5-preload
npm install gulp-minify
npm install gulp-pretty-data
npm install gulp-if
npm install gulp
npm install gulp-debug
npm install del
npm install gulp-series
npm install gulp-prettify
npm install gulp-rimraf
npm install run-sequence

npm install gulp-filelist
*/
var gulp = require('gulp');
var exec = require('gulp-exec');
var del = require('del');
var debug = require('gulp-debug');
var runSequence = require('run-sequence');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var fileList = require('gulp-filelist');
rm = require('gulp-rimraf');

var gulps = require("gulp-series");
var prettify = require('gulp-prettify');

var your_project = 'tradelog';


gulp.task('build__', ['copiaConteudoWeb']);

//gulp.task('default', function () {
//    gulp.watch('app/**/*', ['build']);
//});

gulp.task('default', ['clean', 'copiaConteudoWeb', '1compres', 'geraComponentPreload', '3prepareComponentPreload']);

gulp.task('copiaConteudoWeb', function () {
    gulp.src(['app/**/*'])
        .pipe(replace("http://localhost:58761/odata/", 'http://tradelog.me/servico/odata/'))
        .pipe(gulp.dest('tmpBuild'));

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
            'tmpBuild/**/**.+(js|xml)',
            '!Component-preload.js',
            '!tmpBuild/Component-preload.js',
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

gulp.task('build', function () {
    runSequence('clean', 'copiaMinificada');
});

gulp.task('buildPreload', function () {
    runSequence('geraComponentPreload', 'prepareComponentPreload');
});

gulp.task('copiaMinificada', function () {
    gulp.src(['app/**/*'])
        .pipe(replace("http://localhost:58761/odata/", 'http://tradelog.me/servico/odata/'))
        .pipe(minify({
            exclude: ['tasks'],
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('build'));

});

gulp.task('copiaMinifica2', function () {
    gulp.src(['app/**/*'])
        .pipe(replace("http://localhost:58761/odata/", 'http://tradelog.me/servico/odata/'))
        .pipe(minify({
            exclude: ['tasks'],
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('build').pipe(gulp.src(
            [
                'build/**/**.+(*-min.js)',
                'build/**/**+(*-min.js)',
                'build/**/**.+(min.js)',
                'build/**/**.+(xml)',
                'build/**.+(xml)',
                '!build/**/**.dbg.+(js|xml)'
            ]
        ).pipe(debug())
            //.pipe(gulpif('build/**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: './',
                namespace: your_project,
                fileName: './Component-preload.js'

            }))
            .pipe(gulp.dest('build'))))
        ;


});

//Gera o arquivo component-preload.js a partir da pasta build
gulp.task(
    'geraComponentPreload',
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
            .pipe(debug())
            //.pipe(gulpif('build/**/*.js', uglify())) //only pass .js files to uglify
            //.pipe(gulpif('**/*.xml', prettydata({type: 'minify'}))) // only pass .xml to prettydata
            .pipe(ui5preload({
                base: 'build/',
                namespace: your_project,
                fileName: 'build/Component-preload.js'

            }))
            .pipe(gulp.dest('./'));
    }
);

//substitui caminhos invalidos
gulp.task('prepareComponentPreload', function () {
    return gulp.src(['build/Component-preload.js'])
        .pipe(replace('../build/', ''))
        .pipe(replace('-min.js":', '.js":'))
        .pipe(gulp.dest('build'));

});


gulp.task('clean', function () {
    return del('./build', { force: true });
});



