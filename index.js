'use strict';

const path = require('path');

const globParent = require('glob-parent');
const globby = require('globby');
const list = require('list-promise');
const assign = require('object-assign');
const trash = require('trash');
const File = require('vinyl-rw');

const concat = Array.prototype.concat;

function file(options, contents) {
	return new File(options, contents);
}

function find(globs, options) {
	const localGlobs = concat.call([], globs || []);
	const localOptions = options || {};

	const cwd = localOptions.cwd || process.cwd();
	const base = localOptions.base ||
		path.resolve(cwd, globParent(localGlobs[0] || ''));

	return list(globby(localGlobs, localOptions))
		.map(filepath => new File({
			cwd,
			base,
			path: path.resolve(cwd, filepath)
		}));
}

function read(globs, options) {
	return find(globs, options)
		.map(fileObj => fileObj.read(options));
}

function remove(globs) {
	const localGlobs = concat.call([], globs || []);

	return trash(localGlobs);
}

function write(folder, options) {
	const localOptions = assign({}, {base: folder}, options);

	return fileObj => fileObj.write(localOptions);
}

exports.file = file;
exports.find = find;
exports.read = read;
exports.remove = remove;
exports.write = write;
