import { xmlelement, xmldocument, doctype, fragment } from '../lib'

const element = xmlelement('element', {
    id : 'xmlelement',
    className : 'example',
    classList : ['foo', 'bar', 'wiz'],
    children : 'XML Element node'
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
console.log(doctype({ name : 'aaa', publicId : 'bbb', systemId : 'ccc' }))
console.log(fragment([
    xmlelement('oo'),
    xmlelement('ii'),
    xmlelement('aa'),
]))
