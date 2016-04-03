import test from 'ava';
import Bside from '../src/bside';
import { file } from '../src/spiff';

test('should create a file', async assert => {
	const fileObj = file();

	assert.ok(fileObj instanceof Bside);
	assert.is(fileObj.path, undefined);
});

test('should create a file from a path', async assert => {
	const fileObj = file('fixtures/a.txt');

	assert.ok(fileObj instanceof Bside);
	assert.is(fileObj.path, 'fixtures/a.txt');
	assert.is(fileObj.stem, 'a');
});

test('should create a file from an object', async assert => {
	const fileObj = file({ path: 'fixtures/b.txt' });

	assert.ok(fileObj instanceof Bside);
	assert.is(fileObj.path, 'fixtures/b.txt');
	assert.is(fileObj.stem, 'b');
});

test('should pretty-print buffer contents', async assert => {
	const fileObj = file({
		base: 'fixtures',
		path: 'fixtures/c.txt',
		contents: new Buffer('foo')
	});

	assert.is(fileObj.inspect(), '<File "c.txt" <Buffer 66 6f 6f>>');
});

test('should pretty-print string contents', async assert => {
	const fileObj = file({
		base: 'fixtures',
		path: 'fixtures/d.txt',
		contents: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
	});

	assert.is(fileObj.inspect(), '<File "d.txt" "Lorem ipsum dolor sit amet, consectet...">');
});

test('should be picky about content types', async assert => {
	assert.throws(() => file({
		base: 'fixtures',
		path: 'fixtures/e.txt',
		contents: 42
	}), /File.contents can only be a String,/);
});
