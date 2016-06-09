import test from 'whim/test';
import { read, write } from '..';

test('should write a text file', async t => {
	process.chdir(__dirname);
	t.plan(2);

	return read('fixtures/a.txt')
		.map(f => {
			f.contents = f.contents.toUpperCase();

			return f;
		})
		.map(write('actual'))
		.map(fileObj => {
			t.equal((/actual[\\\/]a.txt$/).test(fileObj.path), true);
			t.equal(fileObj.inspect(), '<File "a.txt" "A\\n">');

			return fileObj;
		});
});

test('should write a binary file', async t => {
	process.chdir(__dirname);
	t.plan(2);

	return read('fixtures/c.gif', null)
		.map(write('actual'))
		.map(fileObj => {
			const expected = '<File "c.gif" <Buffer 47 49 46 38 39 61 01 '
				+ '00 01 00 00 ff 00 2c 00 00 00 00 01 00 01 00 00 02 00 3b>>';

			t.equal((/actual[\\\/]c.gif$/).test(fileObj.path), true);
			t.equal(fileObj.inspect(), expected);

			return fileObj;
		});
});

test('should write multiple files', async t => {
	process.chdir(__dirname);
	t.plan(12);

	return read('fixtures/**/*.txt')
		.map(write('actual'))
		.map(fileObj => {
			t.equal((/actual[\\\/](a|b|(a|b)[\\\/](a|b)).txt$/).test(fileObj.path), true);
			t.equal((/^(a|b){1,2}\n$/).test(fileObj.contents), true);

			return fileObj;
		});
});
