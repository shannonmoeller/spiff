/**
 * # Spiff
 */

import { readFile, outputFile } from 'fs-promise';
import globby from 'globby';
import list from 'list-promise';
import path from 'path';
import toAbsoluteGlob from 'to-absolute-glob';
import toGlobParent from 'glob-parent';
import Bside from './bside';

/**
 * @method file
 * @param {Object} options
 * @return {Bside}
 */
export function file(options) {
	options = options || {};

	if (typeof options === 'string') {
		options = { path: options };
	}

	return new Bside(options);
}

/**
 * @method find
 * @param {String} patterns
 * @param {Object} options
 * @return {Bside}
 */
export function find(patterns, options) {
	options = options || {};

	const firstPattern = toAbsoluteGlob([].concat(patterns)[0], options);
	const cwd = options.cwd || process.cwd();
	const base = options.base || toGlobParent(firstPattern);

	return list(globby(patterns, options))
		.map(async filename => {
			const filepath = path.resolve(cwd, filename);

			return file({ cwd, base, path: filepath });
		});
}

/**
 * @method read
 * @param {String} patterns
 * @param {Object} options
 * @return {Bside}
 */
export function read(patterns, options) {
	options = options || {};

	if (typeof options === 'string') {
		options = { encoding: options };
	}

	if (options.encoding === undefined) {
		options.encoding = 'utf8';
	}

	return find(patterns, options)
		.map(async file => {
			file.contents = await readFile(file.path, options);

			return file;
		});
}

/**
 * @method write
 * @param {String} folder
 * @param {Object} options
 * @return {Bside}
 */
export function write(folder, options) {
	options = options || {};

	const cwd = options.cwd || process.cwd();
	const base = options.base || path.resolve(cwd, folder);

	return async file => {
		const filepath = path.resolve(base, file.relative);

		file.cwd = cwd;
		file.base = base;
		file.path = filepath;

		await outputFile(filepath, file.contents);

		return file;
	};
}
