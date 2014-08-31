var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-file-builder';

function gulpFileBuilder(tokenMap) {

  if (!tokenMap) {
    throw new PluginError(PLUGIN_NAME, 'Missing token map!');
  }

  function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  for (var token in tokenMap) {
    tokenMap[token] = fs.readFileSync(tokenMap[token]);
  }

  var stream = through.obj(function(file, enc, cb) {

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      //convert file buffer to string
      //loop through token map replacing with regexp
      //set file.contents to new buffer
      var fileBuffer,
      fileString = file.contents.toString();

      for (var token in tokenMap) {
        fileString = fileString.replace(new RegExp(escapeRegExp(token), "g"), tokenMap[token]);
      }
      fileBuffer = new Buffer(fileString);

      file.contents = fileBuffer;
    }

    this.push(file);
    cb();
  });

  // returning the file stream
  return stream;
};

// exporting the plugin main function
module.exports = gulpFileBuilder;