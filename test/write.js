import test from 'ava';
import BSide from '../src/b-side';
import { read, write } from '../src/spiff';

test('should write a text file', async assert => {
	assert.plan(3);

	return read('fixtures/a.txt')
		.map(write('actual'))
		.map(fileObj => {
			assert.ok(fileObj instanceof BSide);
			assert.regex(fileObj.path, /actual\/a.txt$/);
			assert.is(fileObj.inspect(), '<File "a.txt" "a\\n">');

			return fileObj;
		});
});

test('should write a binary file', async assert => {
	assert.plan(3);

	return read('fixtures/c.gif', null)
		.map(write('actual'))
		.map(fileObj => {
			assert.ok(fileObj instanceof BSide);
			assert.regex(fileObj.path, /actual\/c.gif$/);
			assert.is(fileObj.inspect(), '<File "c.gif" <Buffer 47 49 46 38 39 61 01 00 01 00 00 ff 00 2c 00 00 00 00 01 00 01 00 00 02 00 3b>>');

			return fileObj;
		});
});

test('should write multiple files', async assert => {
	assert.plan(18);

	return read('fixtures/**/*.txt')
		.map(write('actual'))
		.map(fileObj => {
			assert.ok(fileObj instanceof BSide);
			assert.regex(fileObj.path, /actual\/(a|b|(a|b)\/(a|b)).txt$/);
			assert.regex(fileObj.contents, /^(a|b){1,2}\n$/);

			return fileObj;
		});
});
