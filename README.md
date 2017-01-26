# dommodule

The **dommodule** serves to assemble and manipulate XML documents in JavaScript.
It provides the full set of assemblers for all DOM tree interfaces.

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
