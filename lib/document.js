import { NodeAssembler } from './node'
import { element } from './element'

const DEFAULT_NAMESPACE_URI = ''
const DEFAULT_QUALIFIED_NAME = 'document'

const impl = window.document.implementation

export class DocumentAssembler extends NodeAssembler {
    /**
     * Instantiate a new Document node
     * @param {*} [descriptor]
     * @returns {Document}
     */
    create(descriptor = {}) {
        const constructor = this.constructor
        return this.node = typeof descriptor === 'string'?
            impl.createDocument(constructor.namespaceURI, descriptor, null) :
            impl.createDocument(
                descriptor.namespaceURI || constructor.namespaceURI,
                descriptor.qualifiedName || constructor.qualifiedName,
                descriptor.doctype || null)
    }

    /**
     * Set the document type declaration of the document
     * @param {DocumentType} doctype
     */
    set doctype(doctype) {
        const node = this.node
        const child = this.doctype
        if(child) node.replaceChild(doctype, child)
        else node.prepend(doctype)
    }

    /**
     * Get the document type declaration of the document
     * @returns {DocumentType}
     */
    get doctype() {
        return this.node.doctype
    }

    /**
     * Set the root document element
     * @param {Element|{}} documentElement node or descriptor
     */
    set documentElement(documentElement) {
        const node = this.node
        const root = this.documentElement
        if(documentElement instanceof Element) {
            if(root) node.replaceChild(documentElement, root)
            else node.append(documentElement)
        }
        else {
            if(root) element(root, documentElement)
            else node.append(document({}, documentElement))
        }
    }

    /**
     * Get the root document element
     * @returns {Element|{}} Element
     */
    get documentElement() {
        return this.node.documentElement
    }

    /**
     * Get the default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * Get the default qualified name
     * @returns {String}
     */
    static get qualifiedName() {
        return DEFAULT_QUALIFIED_NAME
    }
}

/**
 * Document assembler factory
 * @param {{}|String|Node} [object]
 * @param {{}} [init]
 * @returns {DocumentAssembler}
 */
export function document(object, init) {
    return new DocumentAssembler(object, init)
}
