// Builds jhash.min.js from jhash.js, after copying the package.json version into
// the " * jhash.js v…" header line of jhash.js.
import fs from 'node:fs';
import path from 'node:path';
import { transformSync } from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');
const file = (name) => path.join(root, name);

// jhash.js uses static class fields (ES2022); the minified file must not use
// anything newer.
const TARGET = 'es2022';

const { version } = JSON.parse(fs.readFileSync(file('package.json'), 'utf8'));
const VERSION_LINE = /^( \* jhash\.js v)\S+/m;

const source = fs.readFileSync(file('jhash.js'), 'utf8');
if (!VERSION_LINE.test(source)) throw new Error('jhash.js: no " * jhash.js v…" header line');
const stamped = source.replace(VERSION_LINE, `$1${version}`);
if (stamped !== source) fs.writeFileSync(file('jhash.js'), stamped);

fs.writeFileSync(file('jhash.min.js'), transformSync(stamped, { loader: 'js', minify: true, target: TARGET }).code);
