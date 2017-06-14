import test from 'ava';
import {read} from '..';

test('should read a text file', t => {
	process.chdir(__dirname);
	t.plan(2);

	return read('fixtures/a.txt')
		.map(fileObj => {
			t.is((/fixtures[\\/]a.txt$/).test(fileObj.path), true);
			t.is(fileObj.inspect(), '<File "a.txt" "a\\n">');

			return fileObj;
		});
});

test('should read a binary file', t => {
	process.chdir(__dirname);
	t.plan(2);

	return read('fixtures/c.gif', null)
		.map(fileObj => {
			const expected = '<File "c.gif" <Buffer 47 49 46 38 39 61 01 ' +
				'00 01 00 00 ff 00 2c 00 00 00 00 01 00 01 00 00 02 00 3b>>';

			t.is((/fixtures[\\/]c.gif$/).test(fileObj.path), true);
			t.is(fileObj.inspect(), expected);

			return fileObj;
		});
});

test('should read multiple files', t => {
	process.chdir(__dirname);
	t.plan(12);

	return read('fixtures/**/*.txt')
		.map(fileObj => {
			t.is((/fixtures[\\/](a|b|(a|b)[\\/](a|b)).txt$/).test(fileObj.path), true);
			t.is((/^(a|b){1,2}\n$/).test(fileObj.contents), true);

			return fileObj;
		});
});
