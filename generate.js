const fs = require('fs');

const minify = require('./utils/minify');
const css = require('./utils/css');

// Folder paths.
const inputs = './inputs/';
const dependencies = './inputs/dependencies/';
const script = './inputs/script/';
const style = './inputs/style/';

const root = './d3VisualTemplate/';
const file = `${root}src/d3.ts`;

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
    console.log('Oops, include at least one D3 JavaScript file in `/inputs/script`.\n')
    process.exit(1);
}

// Delete d3.ts if it already exists.
try {
    fs.accessSync(file, fs.constants.F_OK);
    fs.unlinkSync(file);
} catch (err) { }

// Append code to d3.ts.
fs.appendFileSync(file, 'module powerbi.extensibility.utils {\n\n', 'utf8');
fs.appendFileSync(file, '\texport module D3 {\n\n', 'utf8');
fs.appendFileSync(file, '\t\texport class Content {\n', 'utf8');
fs.appendFileSync(file, '\t\t\tpublic static deps: string = ', 'utf8');

// Append dependency code to d3.ts.
fs.readdirSync(dependencies).forEach(d => {
    var code = minify(dependencies, d);
    fs.appendFileSync(file, JSON.stringify(code), 'utf8');
});

// Append main D3 body to d3.ts.
fs.appendFileSync(file, ';\n\t\t\tpublic static script: string = ', 'utf8');
fs.readdirSync(script).forEach(s => {
    var code = minify(script, s);
    fs.appendFileSync(file, JSON.stringify(code), 'utf8');
});

// Append style code to d3.ts.
fs.appendFileSync(file, ';\n\t\t\tpublic static style: string = ', 'utf8');
fs.readdirSync(style).forEach(s => {
    var code = css(style, s);
    fs.appendFileSync(file, JSON.stringify(code), 'utf8');
});
fs.appendFileSync(file, ';\n\t\t}\n\t}\n}\n', 'utf8');

console.log('Generate script ran successfully.\n');