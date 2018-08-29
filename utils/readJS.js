const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

function readJS (folder, file, minify) {
    var raw = fs.readFileSync(path.join(folder, file), 'utf8');

    if (minify) {
        result = UglifyJS.minify(raw);
        if (result.error) {
            console.log(`There is a compilation error in ${path.join(folder, file)}.`);
            process.exit(1);
        }
        return result.code;
    }

    return raw;
}

module.exports = readJS;