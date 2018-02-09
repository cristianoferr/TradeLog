//https://github.com/enric11/OpenUI5compiler/blob/master/app/gulpfile.js
/*
npm install gulp-replace --save-dev
npm install gulp-uglify --save-dev
npm install gulp-ui5-preload --save-dev
npm install gulp-minify --save-dev
npm install gulp-pretty-data --save-dev
npm install gulp-if --save-dev
npm install gulp --save-dev
npm install gulp-debug --save-dev
npm install del --save-dev
npm install gulp-series --save-dev --save-dev
npm install gulp-prettify
npm install gulp-exec --save-dev
npm install gulp-rimraf --save-dev
npm install run-sequence --save-dev
npm install gulp-filelist --save-dev
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
            'build/**/**.+(js|xml)',
            '!Component-preload.js',
            '!build/Component-preload.js',
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
    runSequence('clean', 'copiaConteudoWeb', 'copiaMinificada');
});

gulp.task('buildPreload', function () {
    runSequence('geraComponentPreload', 'prepareComponentPreload');
});

gulp.task('copiaConteudoWeb', function () {
    gulp.src(['app/**/*',
        '!app/**/*.+(json|js|xml)'
    ])
        .pipe(gulp.dest('build'));

});


gulp.task('copiaMinificada', function () {


    gulp.src(['app/**/*.+(js|json|xml)'])
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



