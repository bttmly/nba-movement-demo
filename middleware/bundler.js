var path = require("path");
var fs = require("fs");

var browserify = require("browserify");

var CLIENT_DIR = path.join(__dirname, "../public");
var ENTRY = path.join(CLIENT_DIR, "src/index.js");
var BUNDLE = path.join(CLIENT_DIR, "bundle.js");

module.exports = function browserifyMiddleware (req, res, next) {
  if (req.url.indexOf("bundle.js") === -1) return next();

  browserify(ENTRY)
    .transform("babelify", {presets: ["es2015", "stage-0"]})
    .bundle()
    .pipe(fs.createWriteStream(BUNDLE))
    .on("close", next)
    .on("error", next);
}