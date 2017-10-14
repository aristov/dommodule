import { attr, element, } from '../lib'
import { xmlns } from './xmlns'
import { role, button } from './role'

element({
    qualifiedName : 'document',
    attributes : [xmlns(), role('article')],
    parentNode : document,
    children : [
        element({
            attributes : [
                attr({
                    prefix : 'xmlns',
                    localName : 'rdfs',
                    namespaceURI : 'http://www.w3.org/2000/xmlns/',
                    value : 'http://www.w3.org/2000/01/rdf-schema#'
                }),
                attr({
                    name : 'xmlns:rdf',
                    namespaceURI : 'http://www.w3.org/2000/xmlns/',
                    value : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
                }),
                xmlns({
                    localName : 'html',
                    value : 'http://www.w3.org/1999/xhtml'
                }),
                xmlns('http://www.w3.org/2000/svg'),
            ],
            children : 'element'
        }),
        element({
            attributes : { role : 'radio' }
        }),
        element({
            attributes : [
                attr({ name : 'role', value : 'button' })
            ]
        }),
        element({
            attributes : [role('checkbox')]
        }),
        element({
            attributes : [button()]
        }),
        element({
            attributes : [button({ value : '123' })]
        }),
        button([
            button('button'),
            button({ children : 'children' }),
            button({ childNodes : 'childNodes' })
        ])
    ]
})
