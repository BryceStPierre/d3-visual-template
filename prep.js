const fs = require('fs');

// Folder paths.
const inputs = './inputs/';
const dependencies = './inputs/dependencies/';
const script = './inputs/script/';
const style = './inputs/style/';

// Creates a folder, if it does not exist.
function createFolder (path) {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    } catch (err) {
        fs.mkdirSync(path);
        console.log(`Created ${path.replace('.','')}.`);
    }
}

console.log('\nRunning prep script...\n');

// Create the following folder structure:
// + /inputs
//      + /dependencies
//      + /script
//      + /style
createFolder(inputs);
createFolder(dependencies);
createFolder(script);
createFolder(style);

// Log instructions.
console.log('\nWrite or paste dependency JavaScript files (.js) in `/inputs/dependencies`...');
console.log('Write or paste main D3 JavaScript file (.js) in `/inputs/script`...');
console.log('Write or paste main CSS stylesheet (.css) in `/inputs/style`...');
console.log('\nOnce you have done this, use `npm start` or `npm run build` to proceed.\n')
