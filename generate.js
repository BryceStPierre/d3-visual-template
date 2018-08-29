const fs = require('fs');

const readJS = require('./utils/readJS');
const readCSS = require('./utils/readCSS');

// Parsed config data from root of project.
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Folder paths.
const inputs = './inputs/';
const dependencies = './inputs/dependencies/';
const script = './inputs/script/';
const style = './inputs/style/';

const target = `./d3VisualTemplate/src/d3.ts`;

console.log('\nRunning generate script...\n');

// Verify that folders exist.
try {
    fs.accessSync(inputs, fs.constants.F_OK);
    fs.accessSync(dependencies, fs.constants.F_OK);
    fs.accessSync(script, fs.constants.F_OK);
    fs.accessSync(style, fs.constants.F_OK);
} catch (err) {
    console.log('Oops, hang on, use `npm run prep`, and then follow the instructions.\n');
    process.exit(1);
}

// Verify that at least one D3 JavaScript file exists.
if (fs.readdirSync(script).length === 0) {
    console.log('Oops, include at least a D3 JavaScript file in `/inputs/script`.\n')
    process.exit(1);
}

// Delete d3.ts if it already exists.
try {
    fs.accessSync(target, fs.constants.F_OK);
    fs.unlinkSync(target);
} catch (err) { }

// Append code to d3.ts.
fs.appendFileSync(target, 'module powerbi.extensibility.utils {\n\n', 'utf8');
fs.appendFileSync(target, '\texport module D3 {\n\n', 'utf8');
fs.appendFileSync(target, '\t\texport const dependencies = [', 'utf8');

// Append dependency code to d3.ts.
config.dependencies.forEach((d, index, array) => {
    var code = readJS(dependencies, d.name, d.shrink ? true : false);

    fs.appendFileSync(target, JSON.stringify(code), 'utf8');
    if (index !== array.length - 1)
        fs.appendFileSync(target, ',', 'utf8');
});

// Append main D3 body to d3.ts.
fs.appendFileSync(target, '];\n\t\texport const script = ', 'utf8');
fs.readdirSync(script).forEach(s => {
    var code = readJS(script, s, true);
    fs.appendFileSync(target, JSON.stringify(code), 'utf8');
});

// Append style code to d3.ts.
fs.appendFileSync(target, ';\n\t\texport const style = ', 'utf8');
fs.readdirSync(style).forEach(s => {
    var code = readCSS(style, s);
    fs.appendFileSync(target, JSON.stringify(code), 'utf8');
});
fs.appendFileSync(target, ';\n\t}\n}\n', 'utf8');

console.log('Generate script ran successfully.\n');