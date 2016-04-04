# `spiff`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

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
    .map(fileObj => {
        fileObj.contents = htmlMinifier.minify(fileObj.contents);

        return fileObj;
    })
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

### file(options) : BSide

- `options` `Object`
  - `cwd` `String` (default: `process.cwd()`) Current working directory.
  - `base` `String` (default: `cwd`) Base path from which to derive relative paths.
  - `path` `String` File path.

Creates a [`BSide`](#bside) file.

### find(glob, [options]) : ListPromise\<BSide\>

- `glob` `String|Array<String>`
- `options` `Object` Options for [`globby`](https://github.com/sindresorhus/globby).

Finds files matching a glob pattern and provides them as a [Promise-aware list](https://github.com/shannonmoeller/list-promise) of [`BSide`](#bside) objects. Does not read file contents into memory.

### read(glob, [options]) : ListPromise\<BSide\>

- `glob` `String|Array<String>`
- `options` `Null|String|Object` If null or a string, value is used as the encoding when reading. If an object, options for [`globby`](https://github.com/sindresorhus/globby) and `fs.readFile`.
  - `encoding` `{String}` (default: `'utf8'`) File encoding. Set to `null` to use Buffers instead of Strings.

Finds files matching a glob pattern and provides them as a [Promise-aware list](https://github.com/shannonmoeller/list-promise) of [`BSide`](#bside) objects. Reads file contents into memory.

### write([dir, [options]]) : Function(fileObj) : BSide

- `dir` `String` (default: `file.base`) Optional alternate directory in which to write a file. By default, files will be saved to their current `.path` value.
- `options` `Object` Options for `fs.writeFile`.

Generates a callback that accepts a [`BSide`](#bside) file and writes it to the file system, optionally in a different location. Returns the file so that you may continue iterating after writing.

#### callback

- `fileObj` `BSide` The [`BSide`](#bside) file to be written.

Accepts a file and writes it to the file system. Returns the file to continue operating on it, if needed.

## BSide

A [vinyl file](https://github.com/gulpjs/vinyl) with first-class string support. No more converting to and from buffers unless you really want to.

```js
const fileObj = new BSide();

fileObj.contents = 'Lorem ipsum.'; // legit
```

### .isString() : Boolean

Returns whether or not the current file contents are a string.

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© Shannon Moeller <me@shannonmoeller.com> (http://shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/spiff/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/spiff
[downloads-img]: http://img.shields.io/npm/dm/spiff.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/spiff.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/spiff
[travis-img]:    http://img.shields.io/travis/shannonmoeller/spiff.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/spiff
