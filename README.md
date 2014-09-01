gulp-file-builder
=================
Replaces patterns in selected files with the defined file.

    `var tokenMap = {`
      `"[> header <]": "src/partials/header.partial",`
      `"[> footer <]": "src/partials/footer.partial"`
    `};`
 
    `return gulp.src('src/**/*.html')`
    `.pipe(fileBuilder(tokenMap))`
    `.pipe(gulp.dest('public'));`