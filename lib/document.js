import {
    DEFAULT_DOCUMENT_NAME,
    DEFAULT_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    Element, implementation
} from './core'
import { ElementAssembler } from './element'
import { DocumentTypeAssembler } from './doctype'
import { ParentNodeAssembler } from './parentnode'

const DEFAULT_DOCTYPE = null

/**
 * Document DOM node assembler
 */
export class DocumentAssembler extends ParentNodeAssembler {
    /**
     * Set the associated document type declaration node
     * @param {*} doctype node or assembler
     */
    set doctype(doctype) {
        const node = this.node
        const ref = this.doctype
        const child = doctype instanceof DocumentTypeAssembler?
            doctype.node :
            doctype
        if(ref) {
            node.replaceChild(child, ref.node)
        }
        else node.prepend(child)
    }

    /**
     * The associatied document type declaration node
     * @returns {DocumentType}
     */
    get doctype() {
        return this.getInstance(this.node.doctype)
    }

    /**
     * Set the root document element
     * @param {*} documentElement node or assembler or init dictionary
     */
    set documentElement(documentElement) {
        const node = this.node
        const element = this.documentElement
        if(documentElement instanceof ElementAssembler) {
            if(element) {
                node.replaceChild(documentElement.node, element.node)
            }
            else documentElement.parentNode = node
        }
        else if(documentElement instanceof Element) {
            if(element) {
                node.replaceChild(documentElement, element.node)
            }
            else node.appendChild(documentElement)
        }
        else {
            if(element) element.init(documentElement)
            else {
                const { elementAssembler } = this.constructor
                const init = { parentNode : node }
                new elementAssembler(documentElement, init)
            }
        }
    }

    /**
     * The root document element
     * @returns {Element} Element
     */
    get documentElement() {
        return this.getInstance(this.node.documentElement)
    }

    /**
     * Create the specified Document node
     * @param {*} [init]
     * @returns {Document}
     */
    static create(init) {
        const {
            namespaceURI = this.namespaceURI,
            prefix = this.prefix,
            localName = this.localName,
            doctype = this.doctype
        } = init || this
        let qualifiedName = init && init.qualifiedName
        if(!qualifiedName) {
            qualifiedName = prefix?
                prefix + NAMESPACE_SEPARATOR + localName :
                localName
        }
        return implementation.createDocument(
            namespaceURI,
            qualifiedName,
            doctype instanceof DocumentTypeAssembler?
                doctype.node :
                doctype)
    }

    /**
     * The default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * The qualified name of the document element node
     * @returns {String}
     */
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + NAMESPACE_SEPARATOR + localName :
            localName
    }

    /**
     * The namespace prefix of the document element node
     * @returns {String}
     */
    static get prefix() {
        return DEFAULT_PREFIX
    }

    /**
     * The local name of the document element node
     * @returns {String}
     */
    static get localName() {
        return this === DocumentAssembler? DEFAULT_DOCUMENT_NAME : this.name
    }

    /**
     * Doctype redefenition facility
     * @returns {*|null}
     */
    static get doctype() {
        return DEFAULT_DOCTYPE
    }

    /**
     * @returns {Function}
     */
    static get elementAssembler() {
        return ElementAssembler
    }
}
