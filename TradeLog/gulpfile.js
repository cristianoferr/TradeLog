var gulp = require('gulp');
var del  = require('del');

gulp.task('copiaConteudoWeb', function() {
	del(['www/**/*']).then(function (erro) {
		gulp.src(['../monpag/WebContent/**/*','!../monpag/WebContent/.git'])
			.pipe(gulp.dest('www'));
	});
});

gulp.task('cordovaPrepare', function() {
	setTimeout(function(){
		var exec = require('child_process').exec;
		exec('cordova prepare', function (erro, stdout, stderr) {
			if (erro)   console.log(erro);
			if (stdout) console.log(stdout);
			if (stderr) console.log(stderr);
		});
	}, 3000);
});

gulp.task('build', ['copiaConteudoWeb', 'cordovaPrepare']);

gulp.task('default', function() {
	gulp.watch('../monpag/WebContent/**/*.*', ['build']);
});
