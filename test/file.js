import test from 'whim/test';
import { file } from '..';

test('should create a file', async t => {
	process.chdir(__dirname);

	const fileObj = file();

	t.is(fileObj.path, undefined);
});

test('should create a file from a path', async t => {
	process.chdir(__dirname);

	const fileObj = file('fixtures/a.txt');

	t.is(fileObj.path, 'fixtures/a.txt');
	t.is(fileObj.stem, 'a');
});

test('should create a file from an object', async t => {
	process.chdir(__dirname);

	const fileObj = file({ path: 'fixtures/b.txt' });

	t.is(fileObj.path, 'fixtures/b.txt');
	t.is(fileObj.stem, 'b');
});

test('should create a file with content', async t => {
	process.chdir(__dirname);

	const fileObj = file('foo.txt', 'bar');

	t.is(fileObj.path, 'foo.txt');
	t.is(fileObj.contents, 'bar');
});
