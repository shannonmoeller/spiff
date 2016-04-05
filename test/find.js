import test from 'ava';
import BSide from '../src/b-side';
import { find } from '../src/spiff';

test('should find a file', async assert => {
	assert.plan(3);

	return find('fixtures/a.txt')
		.map(fileObj => {
			assert.ok(fileObj instanceof BSide);
			assert.regex(fileObj.path, /fixtures\/a.txt$/);
			assert.is(fileObj.contents, null);

			return fileObj;
		});
});

test('should find multiple files', async assert => {
	assert.plan(18);

	return find('fixtures/**/*.txt')
		.map(fileObj => {
			assert.ok(fileObj instanceof BSide);
			assert.regex(fileObj.path, /fixtures\/(a|b|(a|b)\/(a|b)).txt$/);
			assert.is(fileObj.contents, null);

			return fileObj;
		});
});
