[![spiff](https://cdn.rawgit.com/shannonmoeller/spiff/a7c17c6/media/logo.svg)](https://github.com/shannonmoeller/spiff#readme)

[![NPM version][npm-img]][npm-url]
[![Downloads][downloads-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage Status][coveralls-img]][coveralls-url]
[![Tip][amazon-img]][amazon-url]

Promise-based file-system adapter and transmogrifier.

## Install

    $ npm install --save spiff

## Usage

The simplest usage of `spiff` copies files from one location to another.

```js
import { read, write } from 'spiff';

read('src/styles/**/*.css')
    .map(write('dest/styles'));
```

That's all well and good, but it's not very interesting. Let's change the files.

```js
import { read, write } from 'spiff';

read('src/styles/**/*.css')

    // Replace all whitespace with a single space.
    .map(cssFile => {
        cssFile.contents = cssFile.contents.replace(/\s+/, ' ');

        return cssFile;
    })

    .map(write('dest/styles'));
```

That did the trick. But look at all that code just to change one property. We can do better.

```js
import { read, write } from 'spiff';

read('src/styles/**/*.css')

    // Replace all whitespace with a single space.
    .mapProp('contents', x => x.replace(/\s+/, ' '))

    .map(write('dest/styles'));
```

Now we're talking! But we're spitting out each file individually. Let's bundle them.

```js
import { file, read, write } from 'spiff';

read('src/styles/**/*.css')

    // Replace all whitespace with a single space.
    .mapProp('contents', x => x.replace(/\s+/, ' '))

    // Concatenate multiple files into one.
    .reduce(
        // Add each css file to the bundle.
        (bundle, cssFile) => {
            bundle.contents += cssFile.contents;

            return bundle;
        },
        // Start with a new empty file.
        file('bundle.css')
    )

    .map(write('dest/styles'));
```

### async/await

The `find` and `read` functions return a special type of Promise object called a [`ListPromise`][list]. These lists provide a means of iterating through items with maximum concurrency, but are ultimately just Promises. Therefore, you can await the results.

```js
async function bundleAssets() {
    await read('src/scripts/**/*.js')
        .map(write('dest/scripts'));

    await read('src/styles/**/*.css')
        .map(write('dest/styles'));
}
```

See the [`ListPromise` documentation][list] for more information on the available iteration methods.

## API

### file([options, [contents]]) : VinylRW

- `options` `Object`
  - `cwd` `String` (default: `process.cwd()`) Current working directory.
  - `base` `String` (default: `cwd`) Base path from which to derive relative paths.
  - `path` `String` File path.
- `contents` `{String|Buffer|Stream}` - (default: `null`) File contents.

Creates a new [`VinylRW`][vrw] file.

```js
file('README.md', '# TODO');
```

### find(glob, [options]) : ListPromise\<VinylRW\>

- `glob` `String|Array<String>`
- `options` `Object` Options for [`globby`][globby].

Finds files matching a glob pattern and provides them as a [Promise-aware list][list] of [`VinylRW`][vrw] objects. Does not read file contents into memory.

```js
find('src/images/**/*.{jpg,png}')
    .map(x => x.path)
    .map(console.log);
```

### read(glob, [options]) : ListPromise\<VinylRW\>

- `glob` `String|Array<String>`
- `options` `Null|String|Object` If null or a string, value is used as the encoding when reading. If an object, options for [`globby`][globby] and `fs.readFile`.
  - `encoding` `{String}` (default: `'utf8'`) File encoding. Set to `null` to use Buffers instead of Strings.

Finds files matching a glob pattern and provides them as a [Promise-aware list][list] of [`VinylRW`][vrw] objects that can be [mapped, filtered, reduced, and sorted][list]. Reads file contents into memory.

```js
// text files
read('src/styles/**/*.css')
    .map(write('dest/styles'));

// special encoding
read('src/data/**/*.csv', 'ucs2')
    .map(write('dest/data'));

// binary files
read('src/images/**/*.png', null)
    .map(write('dest/images'));
```

### remove(glob) : Promise

- `glob` `String|Array<String>`

Permanently deletes files and directories.

```js
remove('dest/**/*.tmp');
```

### write([dir, [options]]) : Function

- `dir` `String` (default: `file.base`) Optional alternate directory in which to write a file. By default, files will be saved to their current `.path` value.
- `options` `Object` Options for `fs.writeFile`.

Returns a callback that accepts a [`VinylRW`][vrw] file and writes it to the file system, optionally in a different location.

#### callback(fileObj) : VinylRW

- `fileObj` `VinylRW` The [`VinylRW`][vrw] file to be written.

Writes a file to the file system based on the file's path property. Returns the file so that you may continue iterating after writing.

```js
read('src/styles/**/*.css')
    .map(write('dest/styles'));
```

[globby]: https://github.com/sindresorhus/globby#readme
[list]:   https://github.com/shannonmoeller/list-promise#readme
[vrw]:    https://github.com/shannonmoeller/vinyl-rw#readme

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

MIT © [Shannon Moeller](http://shannonmoeller.com)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/spiff/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/spiff
[downloads-img]: http://img.shields.io/npm/dm/spiff.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/spiff.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/spiff
[travis-img]:    http://img.shields.io/travis/shannonmoeller/spiff/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/spiff
