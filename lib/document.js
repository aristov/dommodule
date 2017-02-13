import { ParentNodeAssembler } from './parentnode'
import { DocumentTypeAssembler } from './doctype'
import { ElementAssembler, element } from './element'

import {
    DEFAULT_NAMESPACE_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    DEFAULT_DOCUMENT_NAME,
    DEFAULT_DOCUMENT_TYPE,
} from './defaults'

const { document : { implementation } } = window

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
        if(ref) {
            const child = doctype instanceof DocumentTypeAssembler?
                doctype.node :
                doctype
            node.replaceChild(child, ref)
        }
        else node.prepend(doctype)
    }

    /**
     * The associatied document type declaration node
     * @returns {DocumentType}
     */
    get doctype() {
        return this.node.doctype
    }

    /**
     * Set the root document element
     * @param {*} documentElement node or assembler or init dictionary
     */
    set documentElement(documentElement) {
        const node = this.node
        const root = this.documentElement
        if(documentElement instanceof ElementAssembler) {
            if(!documentElement.node) documentElement.assemble()
            if(root) node.replaceChild(documentElement.node, root)
            else documentElement.parentNode = node
        }
        else if(documentElement instanceof Element) {
            if(root) node.replaceChild(documentElement, root)
            else node.append(documentElement)
        }
        else {
            if(root) element(root).init(documentElement)
            else node.append(element(documentElement))
        }
    }

    /**
     * The root document element
     * @returns {Element} Element
     */
    get documentElement() {
        return this.node.documentElement
    }

    /**
     * Instantiate a new Document node
     * @param {*} [namespaceURI]
     * @param {*} [qualifiedName]
     * @param {*} [doctype]
     * @returns {Document}
     */
    static create({
        namespaceURI = this.namespaceURI,
        qualifiedName = this.qualifiedName,
        doctype = this.doctype
    } = this) {
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
        return DEFAULT_NAMESPACE_PREFIX
    }

    /**
     * The local name of the document element node
     * @returns {String}
     */
    static get localName() {
        return this === DocumentAssembler?
            DEFAULT_DOCUMENT_NAME :
            this.name
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
