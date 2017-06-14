import test from 'ava';
import {read, write} from '..';

test('should write a text file', t => {
	process.chdir(__dirname);
	t.plan(2);

	return read('fixtures/a.txt')
		.map(fileObj => {
			fileObj.contents = fileObj.contents.toUpperCase();

			return fileObj;
		})
		.map(write('actual'))
		.map(fileObj => {
			t.is((/actual[\\/]a.txt$/).test(fileObj.path), true);
			t.is(fileObj.inspect(), '<File "a.txt" "A\\n">');

			return fileObj;
		});
});

test('should write a binary file', t => {
	process.chdir(__dirname);
	t.plan(2);

	return read('fixtures/c.gif', null)
		.map(write('actual'))
		.map(fileObj => {
			const expected = '<File "c.gif" <Buffer 47 49 46 38 39 61 01 ' +
				'00 01 00 00 ff 00 2c 00 00 00 00 01 00 01 00 00 02 00 3b>>';

			t.is((/actual[\\/]c.gif$/).test(fileObj.path), true);
			t.is(fileObj.inspect(), expected);

			return fileObj;
		});
});

test('should write multiple files', t => {
	process.chdir(__dirname);
	t.plan(12);

	return read('fixtures/**/*.txt')
		.map(write('actual'))
		.map(fileObj => {
			t.is((/actual[\\/](a|b|(a|b)[\\/](a|b)).txt$/).test(fileObj.path), true);
			t.is((/^(a|b){1,2}\n$/).test(fileObj.contents), true);

			return fileObj;
		});
});
