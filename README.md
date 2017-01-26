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
        <td><code>EventTarget</code></td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td><code>Node</code></td>
        <td>—</td>
        <td>—</td>
    </tr>
    <tr>
        <td><code>Document</code></td>
        <td><code>document()</code></td>
        <td>—</td>
    </tr>
    <tr>
        <td><code>DocumentType</code></td>
        <td><code>doctype()</code></td>
        <td><code>&lt;!DOCTYPE&gt;</code></td>
    </tr>
    <tr>
        <td><code>DocumentFragment</code></td>
        <td><code>fragment()</code></td>
        <td>—</td>
    </tr>
    <tr>
        <td><code>Element</code></td>
        <td><code>element()</code></td>
        <td><code>&lt;element/&gt;</code></td>
    </tr>
    <tr>
        <td><code>Text</code></td>
        <td><code>text()</code></td>
        <td><code>text</code></td>
    </tr>
    <tr>
        <td><code>CDATASection</code></td>
        <td><code>cdata()</code></td>
        <td><code>&lt;![CDATA[character data section]]&gt;</code></td>
    </tr>
    <tr>
        <td><code>Comment</code></td>
        <td><code>comment()</code></td>
        <td><code>&lt;!--comment--&gt;</code></td>
    </tr>
    <tr>
        <td><code>ProcessingInstruction</code></td>
        <td><code>instruction()</code></td>
        <td><code>&lt;?processing instruction?&gt;</code></td>
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
