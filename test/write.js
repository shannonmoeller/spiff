import test from 'ava';
import { read, write } from '../src/spiff';

test('should read multiple globbed files', async assert => {
	return read('fixtures/**/*.txt', {})
		.map(file => {
			file.contents = `actual ${file.contents}`;

			return file;
		})
		.map(write('actual'))
		.then(() => assert.ok(true));
});
