var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');

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

gulp.task('build', ['copiaConteudoWeb']);

gulp.task('default', function () {
    gulp.watch('app/**/*', ['build']);
});
