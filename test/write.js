import test from 'ava';
import { read, write } from '../src/spiff';

test('should a files', async assert => {
	assert.plan(2);

	const expectedBase = /actual$/;
	const expectedContents = /^<File "[^.]+.txt" "actual Lorem/;

	return read('fixtures/a.txt')
		.map(file => {
			file.contents = `actual ${file.contents}`;

			return file;
		})
		.map(write('actual'))
		.map(file => {
			assert.ok(expectedBase.test(file.base));
			assert.ok(expectedContents.test(file.inspect()));
		});
});

test('should write multiple globbed files', async assert => {
	assert.plan(12);

	const expectedBase = /actual$/;
	const expectedContents = /^<File "[^.]+.txt" "actual/;

	return read('fixtures/**/*.txt')
		.map(file => {
			file.contents = `actual ${file.contents}`;

			return file;
		})
		.map(write('actual'))
		.map(file => {
			assert.ok(expectedBase.test(file.base));
			assert.ok(expectedContents.test(file.inspect()));
		});
});
