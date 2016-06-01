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
	globs = concat.call([], globs || []);
	options = options || {};

	var cwd = options.cwd || process.cwd();
	var base = options.base || path.resolve(cwd, globParent(globs[0]));

	return list(globby(globs, options))
		.map(function (filepath) {
			return new File({
				cwd: cwd,
				base: base,
				path: path.resolve(cwd, filepath)
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
	globs = concat.call([], globs || []);

	return trash(globs);
}

function write(folder, options) {
	options = assign({}, { base: folder }, options);

	return function (fileObj) {
		return fileObj.write(options);
	};
}

exports.file = file;
exports.find = find;
exports.read = read;
exports.remove = remove;
exports.write = write;
