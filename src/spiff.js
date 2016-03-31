/**
 * # Spiff
 */

import { readFile } from 'fs-promise';
import globby from 'globby';
import list from 'list-promise';
import Bside from './bside';

/**
 * @method file
 * @param {Object} options
 * @return {File}
 */
export function file(options) {
	return new Bside(options);
}

/**
 * @method read
 * @param {String} glob
 * @param {Object} options
 * @return {Promise<Array<File>>}
 */
export function read(glob, options) {
	return list(globby(glob, options))
		.map(path => {
			return readFile(path, options)
				.then(contents => file({
					path,
					contents
				}));
		});
}

/**
 * @method write
 * @param {String} dir
 * @param {Object} options
 * @return {Function(Array<File>):Array<File>}}
 */
export function write(dir) {
	return (files) => {
		console.log('write', dir, files);

		return files;
	};
}
