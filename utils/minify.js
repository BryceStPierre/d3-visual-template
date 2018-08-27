const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

function minify (folder, file) {
    var result = UglifyJS.minify(
        fs.readFileSync(path.join(folder, file), 'utf8')
    );
    if (result.error) {
        console.log(`There is a compilation error in ${path.join(folder, file)}.`);
        process.exit(1);
    }
    return result.code;
}

module.exports = minify;