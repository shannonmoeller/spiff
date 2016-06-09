import test from 'whim/test';
import { find } from '..';

test('should not find a file', async t => {
	process.chdir(__dirname);
	t.plan(0);

	return find()
		.map(fileObj => {
			t.fail();

			return fileObj;
		});
});

test('should find a file', async t => {
	process.chdir(__dirname);
	t.plan(2);

	return find('fixtures/a.txt')
		.map(fileObj => {
			t.equal((/fixtures[\\\/]a.txt$/).test(fileObj.path), true);
			t.equal(fileObj.contents, null);

			return fileObj;
		});
});

test('should find multiple files', async t => {
	process.chdir(__dirname);
	t.plan(12);

	return find('fixtures/**/*.txt')
		.map(fileObj => {
			t.equal((/fixtures[\\\/](a|b|(a|b)[\\\/](a|b)).txt$/).test(fileObj.path), true);
			t.equal(fileObj.contents, null);

			return fileObj;
		});
});
