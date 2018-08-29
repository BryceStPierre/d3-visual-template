const fs = require('fs');
const path = require('path');

const createFolder = require('./utils/createFolder');

const original = './d3VisualTemplate/dist/d3VisualTemplate.pbiviz';
const build = './build/';
const filename = 'd3viz.pbiviz';

console.log('\nRunning copy script...');

// Create build folder if it does not exist.
createFolder('./build');

// Ensure that the new build file exists.
try {
    fs.accessSync(original, fs.constants.F_OK);
} catch (err) {
    console.log('Oops, the packaged .pbiviz file does not exist.');
    process.exit(1);
}

// Delete previous build if it exists.
try {
    fs.accessSync(filename, fs.constants.F_OK);
    fs.unlinkSync(filename);
} catch (err) { }

// Copy .pbiviz file into ./build folder.
fs.copyFileSync(original, path.join(build, filename));

console.log('\nCopy script ran successfully.');
console.log('\nFind the custom visual in `./build`.\n');