# dommodule

The **dommodule** serves to assemble and manipulate XML documents in JavaScript.
It provides the full set of assemblers for all DOM tree interfaces.

- [document](dist/api/function/index.html#static-function-document) — `Document` node assembler
- [doctype](dist/api/function/index.html#static-function-doctype) — `DocumentType` node assembler (XML: `<!DOCTYPE>`)
- [fragment](dist/api/function/index.html#static-function-fragment) — `DocumentFragment` node assembler 
- [element](dist/api/function/index.html#static-function-element) — `Element` node assembler (XML: `<element/>`)
- [text](dist/api/function/index.html#static-function-text) — `Text` node assembler (XML: `text`)
- [cdata](dist/api/function/index.html#static-function-cdata) — `CDATASection` node assembler (XML: `<![CDATA[character data section]]>`)
- [comment](dist/api/function/index.html#static-function-comment) — `Comment` node assembler (XML: `<!--comment-->`)
- [instruction](dist/api/function/index.html#static-function-instruction) — `ProcessingInstruction` node assembler (XML: `<?processing instruction?>`)

## Installation

```
npm install dommodule
```

## Usage

```js
// import the DOM assemblers
import { document, element } from 'dommodule'

// define the playlist document assembler
function playlist({ title, genre, children }) {
    return document('playlist', {
        documentElement : {
            attributes : { title, genre },
            children
        }
    })
}

// define the track element assembler
function track(attributes) {
    return element('track', { attributes })
}

// create the playlist document using just defined APIs
const doc = playlist({

    // assign attributes of the root
    title : 'Classic hits',
    genre : 'Rock',

    // append children tracks to the root
    children : [
        track({
            author : 'The Doors',
            title : 'Light My Fire',
            year : '1967'
        }),
        track({
            author : 'Led Zeppelin',
            title : 'Black Dog',
            year : '1971'
        })
    ]
})
```

This code generates the document, with the following structure:

```xml
<playlist title="Classic hits" genre="rock">
    <track author="The Doors" title="Light My Fire" year="1967"/>
    <track author="Led Zeppelin" title="Black Dog" year="1971"/>
</playlist>
```

## Development

```
git clone git@github.com:aristov/dommodule.git
cd dommodule
npm install
npm start
```

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/dommodule/master/LICENSE)
