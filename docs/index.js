import { xmlelement, xmldocument, doctype, fragment, text, cdata, comment, instruction } from '../lib'

const element = xmlelement('element', {
    id : 'xmlelement',
    className : 'example',
    classList : ['foo', 'bar', 'wiz'],
    children : [
        'XML Element node',
        fragment([
            xmlelement('document', 'doc'),
            xmlelement('fragment', 'frag'),
            xmlelement('children', 'chil'),
        ]),
        text('Text node'),
        cdata('<CDATA section="node"><example/></CDATA>'),
        comment('Comment node'),
        instruction('xml', 'Processing instruction node')
    ].map((item, i) => [
        i && xmlelement({
            namespaceURI : 'http://www.w3.org/1999/xhtml',
            qualifiedName : 'hr',
        }),
        item
    ])
})

document.documentElement.append(element.node)

console.log(xmlelement())
console.log(xmldocument())
console.log(xmldocument('root'))
console.log(xmldocument({
    namespaceURI : 'http://www.w3.org/1999/xhtml',
    qualifiedName : 'html',
    doctype : doctype('html')
}))
console.log(doctype('html'))
console.log(doctype({ name : 'docx7', publicId : 'blackjack227', systemId : 'morph4' }))
console.log(fragment([
    xmlelement('document', 'doc'),
    xmlelement('fragment', 'frag'),
    xmlelement('children', 'chil'),
]))
console.log(text('Text node'))
console.log(cdata('CDATA section node'))
console.log(comment('Comment node'))
console.log(instruction('processing', 'instruction="node"!"example"'))

// CDATASection
// PINSTRuction =)
