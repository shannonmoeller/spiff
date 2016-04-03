import test from 'ava';
import Bside from '../src/bside';
import { read } from '../src/spiff';

test('should read a text file', async assert => {
	assert.plan(3);

	return read('fixtures/a.txt')
		.map(fileObj => {
			assert.ok(fileObj instanceof Bside);
			assert.ok(fileObj.path.match(/fixtures\/a.txt$/));
			assert.is(fileObj.inspect(), '<File "a.txt" "a\\n">');

			return fileObj;
		});
});

test('should read a binary file', async assert => {
	assert.plan(3);

	return read('fixtures/c.gif', null)
		.map(fileObj => {
			assert.ok(fileObj instanceof Bside);
			assert.ok(fileObj.path.match(/fixtures\/c.gif$/));
			assert.is(fileObj.inspect(), '<File "c.gif" <Buffer 47 49 46 38 39 61 01 00 01 00 00 ff 00 2c 00 00 00 00 01 00 01 00 00 02 00 3b>>');

			return fileObj;
		});
});

test('should read multiple files', async assert => {
	assert.plan(18);

	return read('fixtures/**/*.txt')
		.map(fileObj => {
			assert.ok(fileObj instanceof Bside);
			assert.ok(fileObj.path.match(/fixtures\/(a|b|(a|b)\/(a|b)).txt$/));
			assert.ok(fileObj.contents.match(/^(a|b){1,2}\n$/));

			return fileObj;
		});
});
