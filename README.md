# dommodule

The **dommodule** serves to assemble and manipulate XML documents in JavaScript.
It provides the full set of assemblers for all DOM tree interfaces.

<table>
    <thead>
    <tr>
        <th>DOM interface</th>
        <th>dommodule instance</th>
        <th>XML markup</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>EventTarget</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>Node</td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td>Document</td>
        <td>document()</td>
        <td>—</td>
    </tr>
    <tr>
        <td>DocumentType</td>
        <td>doctype()</td>
        <td>&lt;!DOCTYPE&gt;</td>
    </tr>
    <tr>
        <td>DocumentFragment</td>
        <td>fragment()</td>
        <td>—</td>
    </tr>
    <tr>
        <td>Element</td>
        <td>element()</td>
        <td>&lt;element/&gt;</td>
    </tr>
    <tr>
        <td>Text</td>
        <td>text()</td>
        <td>text</td>
    </tr>
    <tr>
        <td>CDATASection</td>
        <td>cdata()</td>
        <td>&lt;![CDATA[character data section]]&gt;</td>
    </tr>
    <tr>
        <td>Comment</td>
        <td>comment()</td>
        <td>&lt;!--comment--&gt;</td>
    </tr>
    <tr>
        <td>ProcessingInstruction</td>
        <td>instruction()</td>
        <td>&lt;?processing instruction?&gt;</td>
    </tr>
    </tbody>
</table>


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
