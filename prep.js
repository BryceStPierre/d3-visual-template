const createFolder = require('./utils/createFolder');

// Folder paths.
const inputs = './inputs/';
const dependencies = './inputs/dependencies/';
const script = './inputs/script/';
const style = './inputs/style/';

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
