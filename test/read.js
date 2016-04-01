import test from 'ava';
import { read } from '../src/spiff';

test('should read a file', async assert => {
	assert.plan(1);

	const expectedContents = /^<File "[^.]+.txt" "foo bar Lorem/;

	return read('fixtures/a.txt')
		.map(file => {
			file.contents = `bar ${file.contents}`;

			return file;
		})
		.map(file => {
			file.contents = `foo ${file.contents}`;

			return file;
		})
		.map(file => {
			assert.ok(expectedContents.test(file.inspect()));
		});
});

test('should read multiple globbed files', async assert => {
	assert.plan(6);

	const expectedContents = /^<File "[^.]+.txt" "foo bar/;

	return read('fixtures/**/*.txt')
		.map(file => {
			file.contents = `bar ${file.contents}`;

			return file;
		})
		.map(file => {
			file.contents = `foo ${file.contents}`;

			return file;
		})
		.map(file => {
			assert.ok(expectedContents.test(file.inspect()));
		});
});
