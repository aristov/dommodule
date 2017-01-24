import { NodeAssembler } from './node'

export const XML_NS_URI = 'http://www.w3.org/1999/xml'

const DEFAULT_QUALIFIED_NAME = 'document'

const impl = window.document.implementation

export class DocumentAssembler extends NodeAssembler {
    assemble(object, init) {
        if(object instanceof Node) this.node = object
        else this.create(object)
        if(init) this.init(init)
        return this.node
    }
    create({
        namespaceURI = XML_NS_URI,
        qualifiedName = DEFAULT_QUALIFIED_NAME,
        doctype = null
    }) {
        return this.node = impl.createDocument(namespaceURI, qualifiedName, doctype)
    }
    init(init) {
        return Object.assign(this, init)
    }
    set doctype(doctype) {
        const node = this.node
        const child = this.doctype
        if(child) node.replaceChild(doctype, child)
        else node.prepend(doctype)
    }
    get doctype() {
        return this.node.doctype
    }
    set documentElement(documentElement) {
        const node = this.parentNode
        const child = this.documentElement
        if(child) node.replaceChild(documentElement, child)
        else node.appendChild(documentElement)
    }
    get documentElement() {
        return this.node.documentElement
    }
}

export function xmldocument(init) {
    const assembler = new DocumentAssembler({}, init)
    assembler.assemble({}, init)
    return assembler
}
