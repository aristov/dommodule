import { element, } from '../lib'

element({
    qualifiedName : 'document',
    parentNode : document,
    children : [
        element(),
        element({ qualifiedName : 'test' }),
        element({ localName : 'localtest' }),
        element({
            namespaceURI : 'http://www.w3.org/1999/xhtml',
            qualifiedName : 'button'
        }),
        element({
            namespaceURI : 'http://www.w3.org/1999/xhtml',
            localName : 'input'
        }),
        element({
            namespaceURI : 'http://www.w3.org/1999/xhtml',
            prefix : 'html',
            localName : 'select'
        }),
        element({
            namespaceURI : 'http://www.w3.org/2000/01/rdf-schema#',
            qualifiedName : 'rdfs:subClassOf'
        }),
        element({
            namespaceURI : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            prefix : 'rdf',
            localName : 'subPropertyOf'
        }),
    ]
})
