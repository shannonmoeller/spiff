import test from 'ava';
import { read } from '../src/spiff';

test('should read a file', async assert => {
	const expected = /^<File "a.txt" "foo bar Lorem/;

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
			assert.ok(expected.test(file.inspect()));
		});
});

test('should read multiple globbed files', async assert => {
	const expected = /^<File "[^.]+.txt" "foo bar/;

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
			assert.ok(expected.test(file.inspect()));
		});
});
