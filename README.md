[![spiff](https://cdn.rawgit.com/shannonmoeller/spiff/b05a785/logo.svg)](https://github.com/shannonmoeller/spiff#readme)

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][tip-img]][tip-url]

Promise-aware file-system adapter and transmorgrifier.

## Install

    $ npm install --save spiff

## Usage

```js
import { file, read, write } from 'spiff';
import cssnano from 'cssnano';
import handlebars from 'handlebars';
import htmlMinifier from 'html-minifier';

// One-to-one transmorgrification
read('src/**/*.html')
    .map(async fileObj => {
        const [data] = await read(fileObj.path + '.json');

        fileObj.data = JSON.parse(data.contents);

        return fileObj;
    })
    .map(fileObj => {
        const template = handlebars.parse(fileObj.contents);

        fileObj.contents = template(fileObj.data);

        return fileObj;
    })
    .mapProp('contents', x => htmlMinifier.minify(x))
    .map(write('dest'));

// Many-to-one transmorgrification
read('src/styles/*.css')
    .map(async fileObj => {
        const result = await cssnano.process(fileObj.contents);

        fileObj.contents = result.css;

        return fileObj;
    })
    .filter(fileObj => fileObj.contents.length > 20)
    .reduce((bundle, fileObj) => {
        bundle.contents += fileObj.contents;

        return bundle;
    }, file('styles/bundle.css'))
    .then(write('dest'));

// Binary transmorgrification
read('src/**/*.png', null).map(write('dest'));
```

## API

### file([options, [contents]]) : VinylRW

- `options` `Object`
  - `cwd` `String` (default: `process.cwd()`) Current working directory.
  - `base` `String` (default: `cwd`) Base path from which to derive relative paths.
  - `path` `String` File path.
- `contents` `{String|Buffer|Stream}` - (default: `null`) File contents.

Creates a [`VinylRW`][vrw] file.

### find(glob, [options]) : ListPromise\<VinylRW\>

- `glob` `String|Array<String>`
- `options` `Object` Options for [`globby`][globby].

Finds files matching a glob pattern and provides them as a [Promise-aware list][list] of [`VinylRW`][vrw] objects. Does not read file contents into memory.

### read(glob, [options]) : ListPromise\<VinylRW\>

- `glob` `String|Array<String>`
- `options` `Null|String|Object` If null or a string, value is used as the encoding when reading. If an object, options for [`globby`][globby] and `fs.readFile`.
  - `encoding` `{String}` (default: `'utf8'`) File encoding. Set to `null` to use Buffers instead of Strings.

Finds files matching a glob pattern and provides them as a [Promise-aware list][list] of [`VinylRW`][vrw] objects. Reads file contents into memory.

### remove(glob) : Promise

- `glob` `String|Array<String>`

Sends files and directories to the system's [`trash`][trash].

### write([dir, [options]]) : Function

- `dir` `String` (default: `file.base`) Optional alternate directory in which to write a file. By default, files will be saved to their current `.path` value.
- `options` `Object` Options for `fs.writeFile`.

Returns a callback that accepts a [`VinylRW`][vrw] file and writes it to the file system, optionally in a different location.

#### callback(fileObj) : VinylRW

- `fileObj` `VinylRW` The [`VinylRW`][vrw] file to be written.

Writes a file to the file system based on the file's path property. Returns the file so that you may continue iterating after writing.

[globby]: https://github.com/sindresorhus/globby
[list]:   https://github.com/shannonmoeller/list-promise
[trash]:  https://github.com/sindresorhus/trash
[vrw]:    https://github.com/shannonmoeller/vinyl-rw

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© Shannon Moeller <me@shannonmoeller.com> (http://shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[tip-img]:    https://img.shields.io/badge/tip-jar-yellow.svg?style=flat-square
[tip-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/spiff/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/spiff
[downloads-img]: http://img.shields.io/npm/dm/spiff.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/spiff.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/spiff
[travis-img]:    http://img.shields.io/travis/shannonmoeller/spiff.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/spiff
