const fs = require('fs');

// Creates a folder, if it does not exist.
function createFolder (path) {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    } catch (err) {
        fs.mkdirSync(path);
        console.log(`Created ${path.replace('.','')}.`);
    }
}

module.exports = createFolder;