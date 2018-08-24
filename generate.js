const fs = require('fs');

// Folder paths.
const inputs = './inputs/';
const dependencies = './inputs/dependencies/';
const script = './inputs/script/';
const style = './inputs/style/';

const pbiviz = './d3VisualTemplate/';
const d3 = `${pbiviz}src/d3.ts`;

console.log('\nRunning generate script...\n');

// Verify that folders exist.
try {
    fs.accessSync(inputs, fs.constants.F_OK);
    fs.accessSync(dependencies, fs.constants.F_OK);
    fs.accessSync(script, fs.constants.F_OK);
    fs.accessSync(style, fs.constants.F_OK);
} catch (err) {
    console.log('Oops, hang on, please use `npm run prep`, and then follow the instructions.\n');
    process.exit(1);
}

// Verify that at least one D3 JavaScript file exists.
if (fs.readdirSync(script).length === 0) {
    console.log('Oops, please include at least one D3 JavaScript file in `/inputs/script`.\n')
    process.exit(1);
}






// TODO:
// Fill in the generate logic.

console.log('\nGenerate script ran successfully.\n');