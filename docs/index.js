// import './showcase'

import { element, ElementAssembler } from  '../lib/target'

class Anchor extends ElementAssembler {

}

const XS_NAMESPACE_URI = 'http://www.w3.org/2001/XMLSchema'

class Attribute extends ElementAssembler {
    static get prefix() {
        return 'xs'
    }
    static get namespaceURI() {
        return XS_NAMESPACE_URI
    }
}

function attribute(init) {
    return new Attribute(init)
}

element({
    parentNode : document.documentElement,
    childNodes : [
        element({
            qualifiedName : 'a',
            childNodes : 'fuck'
        }),
        element('yeah'),
        new Anchor('test'),
        element({
            qualifiedName : 'a',
            namespaceURI : 'http://www.w3.org/1999/xhtml',
            href : '//github.com',
            childNodes : 'GitHub'
        }),
        element({
            qualifiedName : 'svg',
            namespaceURI : 'http://www.w3.org/2000/svg',
            childNodes : 'SVG'
        }),
        element({
            qualifiedName : 'xs:schema',
            namespaceURI : XS_NAMESPACE_URI
        }),
        new Attribute(),
        new Attribute({
            qualifiedName : 'xsl:template',
            namespaceURI : 'http://www.w3.org/1999/XSL/Transform'
        }),
        attribute({
            node : document.createElement('aaaa')
        })
    ]
})
