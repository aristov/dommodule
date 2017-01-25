import { NodeAssembler } from './node'

const DEFAULT_QUALIFIED_NAME = 'document'

const impl = window.document.implementation

export class DocumentAssembler extends NodeAssembler {

    assemble(object, init) {
        this.create(object)
        return init? this.init(init) : this.node
    }

    create(object = {}) {
        this.node = typeof object === 'string'?
            impl.createDocument('', object, null) :
            impl.createDocument(
                object.namespaceURI,
                object.qualifiedName || DEFAULT_QUALIFIED_NAME,
                object.doctype)
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
        else node.append(documentElement)
    }

    get documentElement() {
        return this.node.documentElement
    }
}

export function xmldocument(object, init) {
    const assembler = new DocumentAssembler
    assembler.assemble(object, init)
    return assembler
}
