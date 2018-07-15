# dommodule

[![NPM Version](https://img.shields.io/npm/v/dommodule.svg)](https://www.npmjs.com/package/dommodule)
[![Build Status](https://travis-ci.org/aristov/dommodule.svg?branch=master)](https://travis-ci.org/aristov/dommodule)
[![Coverage Status](https://coveralls.io/repos/github/aristov/dommodule/badge.svg?branch=master)](https://coveralls.io/github/aristov/dommodule?branch=master)
[![dependencies Status](https://david-dm.org/aristov/dommodule/status.svg)](https://david-dm.org/aristov/dommodule)
[![devDependencies Status](https://david-dm.org/aristov/dommodule/dev-status.svg)](https://david-dm.org/aristov/dommodule?type=dev)

_work in progress_

This JavaScript library provides a set of [DOM](https://www.w3.org/TR/dom) node assemblers for the following interfaces:

- [Attr](https://www.w3.org/TR/dom/#interface-attr)
- [Comment](https://www.w3.org/TR/dom/#interface-comment)
- [Document](https://www.w3.org/TR/dom/#interface-document)
- [DocumentFragment](https://www.w3.org/TR/dom/#interface-documentfragment)
- [DocumentType](https://www.w3.org/TR/dom/#interface-documenttype)
- [Element](https://www.w3.org/TR/dom/#interface-element)
- [Text](https://www.w3.org/TR/dom/#interface-text)

## Examples

See the source code of the dommodule based libraries: [htmlmodule](https://github.com/aristov/htmlmodule), [ariamodule](https://github.com/aristov/ariamodule) and [xmlmodule](https://github.com/aristov/xmlmodule)

## Installation

```
npm install dommodule
```

## Tests

Run tests using [jsdom](https://github.com/jsdom/jsdom):

```
npm test
```

## Development

Clone the project and install dependencies:

```
git clone git@github.com:aristov/dommodule.git
cd dommodule
npm install
```

Run Webpack in watch mode:

```
npm run watch
```

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/dommodule/master/LICENSE)
