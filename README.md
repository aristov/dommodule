# dommodule

<em>work in progress</em>

The **dommodule** is a JavaScript library of DOM node assemblers.

- [attr](lib/attr.js) — `Attr` node assembler (XML: `test="example"`)
- [document](lib/document.js) — `Document` node assembler
- [doctype](lib/doctype.js) — `DocumentType` node assembler (XML: `<!DOCTYPE test>`)
- [fragment](lib/fragment.js) — `DocumentFragment` node assembler 
- [element](lib/element.js) — `Element` node assembler (XML: `<example/>`)
- [text](lib/text.js) — `Text` node assembler (XML: `test`)
- [comment](lib/comment.js) — `Comment` node assembler (XML: `<!--example-->`)
- [instruction](lib/instruction.js) — `ProcessingInstruction` node assembler (XML: `<?test example?>`)

## Installation

```
npm install dommodule
```

## Example

```js
import {
    DocumentAssembler,
    attr, comment, doctype, element,
    fragment, instruction, text
} from '../lib'

new DocumentAssembler([
    doctype('example'),
    fragment([
        instruction({
            target : 'xml-stylesheet',
            attrset : { href : './style.css' },
        }),
        element({
            localName : 'example',
            attributes : attr({ name : 'role', value : 'application' }),
            childNodes : [
                comment('Version 1.0.0'),
                text('Hello world!')
            ]
        })
    ])
])
```

This code generates a document with the following structure:

```xml
<!DOCTYPE example>
<?xml-stylesheet href="./example.css"?>
<example role="application">
     <!--Version 1.0.0-->
     Hello world!
</example>
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
