# dommodule

The dommodule serves to assemble and manipulate XML documents from JavaScript.
It Provides the set of assemblers for all of the commonly used DOM interfaces.

## Installation

```
npm install dommodule
```

## Usage

```js
import { document, element } from 'dommodule'

function playlist(init) {
    return document('playlist', init)
}

function track(init) {
    return element('track', init)
}

const root = playlist({
    attributes : { 
        title : 'Classic hits',
        genre : 'Rock' 
    },
    documentElement : [
        track({ 
            attributes : { 
                author : 'The Doors',
                title : 'Light My Fire',
                year : '1967'
            }
        }),
        track({ 
            attributes : { 
                author : 'Led Zeppelin',
                title : 'Black Dog',
                year : '1971'
            }
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
npm run serve
```

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/dommodule/master/LICENSE)
