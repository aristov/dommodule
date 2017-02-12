import { NodeAssembler } from './node'
import { element } from './element'

const assign = Object.assign

const impl = window.document.implementation

const DEFAULT_NAMESPACE_PREFIX = ''
const DEFAULT_NAMESPACE_URI = ''
const XML_NAMESPACE_SEPARATOR = ':'
const DEFAULT_DOCUMENT_TYPE = null

export class DocumentAssembler extends NodeAssembler {
    /**
     * Instantiate the specified element node
     * @param init
     * @returns {*}
     */
    instantiate(init) {
        if(init && 'node' in init) return super.instantiate(init)
        else return this.node = this.constructor.create(init)
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
     * @param {Element|{}} documentElement node or init
     */
    set documentElement(documentElement) {
        const node = this.node
        const root = this.documentElement
        if(documentElement instanceof Element) {
            if(root) node.replaceChild(documentElement, root)
            else node.append(documentElement)
        }
        else {
            if(root) element(assign({ node : root }, documentElement))
            else node.append(element(documentElement))
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
     * Instantiate a new Document node
     * @param {*} [init]
     * @returns {Document}
     */
    static create(init) {
        const {
            namespaceURI = this.namespaceURI,
            qualifiedName = this.qualifiedName,
            doctype = this.doctype
        } = init || this
        if(init) {
            if('namespaceURI' in init) delete init.namespaceURI
            if('qualifiedName' in init) delete init.qualifiedName
            if('doctype' in init) delete init.doctype
        }
        return impl.createDocument(namespaceURI, qualifiedName, doctype)
    }

    /**
     * Get the default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    static get prefix() {
        return DEFAULT_NAMESPACE_PREFIX
    }

    static get localName() {
        return this.name
    }

    /**
     * The qualified name of the document element node
     * @returns {String}
     */
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + XML_NAMESPACE_SEPARATOR + localName :
            localName
    }

    /**
     * Doctype redefenition facility
     * @returns {null}
     */
    static get doctype() {
        return DEFAULT_DOCUMENT_TYPE
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
