import { Element } from './core'
import { ParentNodeAssembler } from './parentnode'
import { DocumentTypeAssembler } from './doctype'
import { ElementAssembler } from './element'

import {
    DEFAULT_NAMESPACE_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
} from './core'

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
        if(ref) {
            const child = doctype instanceof DocumentTypeAssembler?
                doctype.node :
                doctype
            node.replaceChild(child, ref.node)
        }
        else node.prepend(doctype)
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
        const root = this.documentElement
        if(documentElement instanceof ElementAssembler) {
            if(!documentElement.node) documentElement.assemble()
            if(root) node.replaceChild(documentElement.node, root.node)
            else documentElement.parentNode = node
        }
        else if(documentElement instanceof Element) {
            if(root) node.replaceChild(documentElement, root.node)
            else node.append(documentElement)
        }
        else {
            if(root) root.init(documentElement)
            else node.append(new this.constructor.documentElementClass(documentElement))
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
        return this.implementation.createDocument(
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
        return this === DocumentAssembler? document.name : this.name
    }

    /**
     * Doctype redefenition facility
     * @returns {null}
     */
    static get doctype() {
        return DEFAULT_DOCTYPE
    }

    /**
     * DOMImplementation interface
     * @returns {DOMImplementation}
     */
    static get implementation() {
        return this.document.implementation
    }

    /**
     * @returns {Function}
     */
    static get documentElementClass() {
        return ElementAssembler
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
