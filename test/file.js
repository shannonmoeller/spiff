import test from 'ava';
import {file} from '..';

test('should create a file', t => {
	process.chdir(__dirname);
	t.plan(1);

	const fileObj = file();

	t.is(fileObj.path, undefined);
});

test('should create a file from a path', t => {
	process.chdir(__dirname);
	t.plan(2);

	const fileObj = file('fixtures/a.txt');

	t.is(/fixtures[\\/]a.txt/.test(fileObj.path), true);
	t.is(fileObj.stem, 'a');
});

test('should create a file from an object', t => {
	process.chdir(__dirname);
	t.plan(2);

	const fileObj = file({path: 'fixtures/b.txt'});

	t.is(/fixtures[\\/]b.txt/.test(fileObj.path), true);
	t.is(fileObj.stem, 'b');
});

test('should create a file with content', t => {
	process.chdir(__dirname);
	t.plan(2);

	const fileObj = file('foo.txt', 'bar');

	t.is(fileObj.path, 'foo.txt');
	t.is(fileObj.contents, 'bar');
});
