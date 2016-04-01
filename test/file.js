import test from 'ava';
import { file } from '../src/spiff';
import Bside from '../src/bside';

test('should create a file', async assert => {
	assert.ok(file() instanceof Bside);
});
