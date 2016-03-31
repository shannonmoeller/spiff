import test from 'ava';
import { read } from '../src/spiff';

test('should read a file', async assert => {
	return read('fixtures/a.txt', 'utf8')
		.then(files => console.log(files))
		.then(() => assert.ok(true));
});

test('should read multiple globbed files', async assert => {
	return read('fixtures/**/*.txt', 'utf8')
		.then(files => console.log(files))
		.then(() => assert.ok(true));
});
