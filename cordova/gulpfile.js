var gulp = require('gulp');

gulp.task(
    'update',
    function () {
        return gulp.src(
            [
                '../TradeLog/build/**/**'
            ]
        )
            .pipe(gulp.dest('www'));
    }
);
