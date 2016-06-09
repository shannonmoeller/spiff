'use strict';

var File = require('vinyl-rw');
var assign = require('object-assign');
var globParent = require('glob-parent');
var globby = require('globby');
var list = require('list-promise');
var path = require('path');
var trash = require('trash');

var concat = Array.prototype.concat;

function file(options, contents) {
	return new File(options, contents);
}

function find(globs, options) {
	const localGlobs = concat.call([], globs || []);
	const localOptions = options || {};

	var cwd = localOptions.cwd || process.cwd();
	var base = localOptions.base || path.resolve(cwd, globParent(localGlobs[0]));

	return list(globby(localGlobs, localOptions))
		.map(function (filepath) {
			return new File({
				cwd: cwd,
				base: base,
				path: path.resolve(cwd, filepath),
			});
		});
}

function read(globs, options) {
	return find(globs, options)
		.map(function (fileObj) {
			return fileObj.read(options);
		});
}

function remove(globs) {
	const localGlobs = concat.call([], globs || []);

	return trash(localGlobs);
}

function write(folder, options) {
	const localOptions = assign({}, { base: folder }, options);

	return function (fileObj) {
		return fileObj.write(localOptions);
	};
}

exports.file = file;
exports.find = find;
exports.read = read;
exports.remove = remove;
exports.write = write;
