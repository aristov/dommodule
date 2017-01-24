import { NodeAssembler } from './nodeassembler'

export const XML_NS_URI = 'http://www.w3.org/1999/xml'

const DEFAULT_QUALIFIED_NAME = 'document'

/**
 * doctype
 * documentElement
 */
export class DocumentAssembler extends NodeAssembler {
    create(namespaceURI, qualifiedName, doctype) {
        return document.implementation.createDocument(namespaceURI, qualifiedName, doctype)
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
