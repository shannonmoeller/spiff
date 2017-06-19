'use strict';

const path = require('path');

const del = require('del');
const globParent = require('glob-parent');
const globby = require('globby');
const list = require('list-promise');
const File = require('vinyl-rw');

function file(options, contents) {
	return new File(options, contents);
}

function find(globs, options) {
	const localGlobs = [].concat(globs || []);
	const localOptions = options || {};

	const cwd = localOptions.cwd ||
		process.cwd();

	const base = localOptions.base ||
		path.resolve(cwd, globParent(localGlobs[0] || ''));

	return list(globby(localGlobs, localOptions))
		.map(x => new File({
			cwd,
			base,
			path: path.resolve(cwd, x)
		}));
}

function read(globs, options) {
	return find(globs, options)
		.map(x => x.read(options));
}

// istanbul ignore next
function remove(globs) {
	const localGlobs = [].concat(globs || []);

	return del(localGlobs);
}

function write(folder, options) {
	const localOptions = Object.assign({}, {base: folder}, options);

	return x => x.write(localOptions);
}

exports.file = file;
exports.find = find;
exports.read = read;
exports.remove = remove;
exports.write = write;
