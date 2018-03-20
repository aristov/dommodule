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

## Example

```js
import {
    DocumentAssembler,
    attr, comment, doctype, element,
    fragment, text
} from 'dommodule'

new DocumentAssembler([
    doctype('example'),
    fragment([
        comment('Version 1.0.0'),
        element({
            localName : 'example',
            attributes : attr({ name : 'role', value : 'application' }),
            childNodes : text('Hello world!')
        })
    ])
])
```

This code generates a document with the following structure:

```xml
<!DOCTYPE example>
<!--Version 1.0.0-->
<example role="application">Hello world!</example>
```

## Installation

```
npm install dommodule
```

## Development

```
git clone git@github.com:aristov/dommodule.git
cd dommodule
npm install
npm run webpack
```

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/dommodule/master/LICENSE)
