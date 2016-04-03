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
    .map(async file => {
        const [data] = await read(file.path + '.json');

        file.data = JSON.parse(data.contents);

        return file;
    })
    .map(file => {
        const template = handlebars.parse(file.contents);

        file.contents = template(file.data);

        return file;
    })
    .map(file => {
        file.contents = htmlMinifier.minify(file.contents);

        return file;
    })
    .map(write('dest'));

// Many-to-one transmorgrification
read('src/styles/*.css')
    .map(async file => {
        const result = await cssnano.process(file.contents);

        file.contents = result.css;

        return file;
    })
    .filter(file => file.contents.length > 20)
    .reduce((bundle, file) => {
        bundle.contents += file.contents;

        return bundle;
    }, file('styles/bundle.css'))
    .then(write('dest'));

// Binary transmorgrification
read('src/**/*.png', null).map(write('dest'));
```

## API

### file(options) : Bside

- `options` `Object`
  - `cwd` `String` (default: `process.cwd()`) Current working directory.
  - `base` `String` (default: `cwd`) Base path from which to derive relative paths.
  - `path` `String` File path.

Creates a [`Bside`](#bside) file.

### find(glob, [options]) : ListPromise\<Bside\>

- `glob` `String|Array<String>`
- `options` `Object` Options for [`globby`](https://github.com/sindresorhus/globby).

Finds files matching a glob pattern and provides them as a [Promise-aware list](https://github.com/shannonmoeller/list-promise) of [`Bside`](#bside) objects. Does not read file contents into memory.

### read(glob, [options]) : ListPromise\<Bside\>

- `glob` `String|Array<String>`
- `options` `Object` Options for [`globby`](https://github.com/sindresorhus/globby) and `fs.readFile`.
  - `encoding` `{String}` (default: `'utf8'`) File encoding. Set to `null` to use Buffers instead of Strings.

Finds files matching a glob pattern and provides them as a [Promise-aware list](https://github.com/shannonmoeller/list-promise) of [`Bside`](#bside) objects. Reads file contents into memory.

### write([dir], [options]) : Function(Bside)

- `dir` `String` (default: `file.base`) Optional alternate directory in which to write a file. By default, files will be saved to their current `.path` value.
- `options` `Object` Options for `fs.writeFile`.

Generates a callback that accepts a [`Bside`](#bside) file and writes it to the disk, optionally in a different location. Returns the file so that you may continue iterating after writing.

## Bside

A [vinyl file](https://github.com/gulpjs/vinyl) with first-class string support. No more converting to and from buffers unless you really want to.

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
