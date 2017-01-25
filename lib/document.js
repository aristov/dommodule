import { NodeAssembler } from './node'

const DEFAULT_NAMESPACE_URI = ''
const DEFAULT_QUALIFIED_NAME = 'document'

const impl = window.document.implementation

export class DocumentAssembler extends NodeAssembler {

    create(object = {}) {
        const constructor = this.constructor
        return this.node = typeof object === 'string'?
            impl.createDocument(constructor.namespaceURI, object, null) :
            impl.createDocument(
                object.namespaceURI || constructor.namespaceURI,
                object.qualifiedName || constructor.qualifiedName,
                object.doctype || null)
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

    /**
     *
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     *
     * @returns {String}
     */
    static get qualifiedName() {
        return DEFAULT_QUALIFIED_NAME
    }
}

export function document(object, init) {
    return new DocumentAssembler(object, init)
}
