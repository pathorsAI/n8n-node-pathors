import gulp from 'gulp';

function buildIcons() {
  return gulp.src('nodes/**/*.svg').pipe(gulp.dest('dist/nodes'));
}

gulp.task('build:icons', buildIcons);
