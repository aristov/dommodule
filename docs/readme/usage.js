// import DOM assemblers
import { document, element } from '../../lib'

// define the playlist document assembler
function playlist({ title, genre, children }) {
    return document({
        qualifiedName : 'playlist',
        documentElement : {
            attributes : { title, genre },
            children
        }
    })
}

// define the track element assembler
function track(attributes) {
    return element({ qualifiedName : 'track', attributes })
}

// create the playlist document using just defined APIs
const doc = playlist({

    // assign attributes of the root
    title : 'Classic hits',
    genre : 'Rock',

    // append children tracks to the root
    children : [
        track({
            title : 'Light My Fire',
            author : 'The Doors',
            year : '1967'
        }),
        track({
            title : 'Black Dog',
            author : 'Led Zeppelin',
            year : '1971'
        })
    ]
})

// get root element of just created document
const root = doc.documentElement

// replace the current root by the new one
document(window.document).documentElement = root

// serialize the new created document node
const serializer = new XMLSerializer
const markup = serializer.serializeToString(window.document)

// show the result
root.append(markup)
