import test from 'ava';
import { file } from '../src/spiff';

test('should create a file', async assert => {
	console.log(file);
	assert.ok(true);
});
