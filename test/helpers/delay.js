export function delay(value, ms = 100) {
	return new Promise(cb => setTimeout(
		() => cb(value),
		ms * Math.random()
	));
}
