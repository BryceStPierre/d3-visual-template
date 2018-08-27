const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

function css (folder, file) {
    var result = new CleanCSS().minify(
        fs.readFileSync(path.join(folder, file), 'utf8')
    );
    return result.styles;
}

module.exports = css;