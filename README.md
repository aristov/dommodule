# dommodule

[![NPM Version](https://img.shields.io/npm/v/dommodule.svg)](https://www.npmjs.com/package/dommodule)
[![Build Status](https://travis-ci.org/aristov/dommodule.svg?branch=master)](https://travis-ci.org/aristov/dommodule)
[![Coverage Status](https://coveralls.io/repos/github/aristov/dommodule/badge.svg?branch=master)](https://coveralls.io/github/aristov/dommodule?branch=master)
[![dependencies Status](https://david-dm.org/aristov/dommodule/status.svg)](https://david-dm.org/aristov/dommodule)
[![devDependencies Status](https://david-dm.org/aristov/dommodule/dev-status.svg)](https://david-dm.org/aristov/dommodule?type=dev)

_work in progress_

The **dommodule** is a JavaScript library of DOM node assemblers.

- [attr](lib/attr.js) — `Attr` node assembler (XML: `test="example"`)
- [comment](lib/comment.js) — `Comment` node assembler (XML: `<!--example-->`)
- [document](lib/document.js) — `Document` node assembler
- [doctype](lib/doctype.js) — `DocumentType` node assembler (XML: `<!DOCTYPE test>`)
- [element](lib/element.js) — `Element` node assembler (XML: `<example/>`)
- [fragment](lib/fragment.js) — `DocumentFragment` node assembler
- [text](lib/text.js) — `Text` node assembler (XML: `test`)

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
<example role="application">
     Hello world!
</example>
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
