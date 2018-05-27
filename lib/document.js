import { EMPTY_STRING } from './common'
import { DocumentTypeAssembler } from './doctype'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'
import { ParentNodeAssembler } from './parentnode'

const {
    Document,
    DocumentType,
    Element,
    document : { implementation }
} = window

let isConstructorSupported = true
try {
    new Document
}
catch(error) {
    isConstructorSupported = false
}

/**
 * @see https://www.w3.org/TR/dom/#interface-document
 */
export class DocumentAssembler extends ParentNodeAssembler {
    /**
     * @param {string} id
     * @returns {ElementAssembler}
     */
    getElementById(id) {
        return this.getInstanceOf(this.node.getElementById(id))
    }

    /**
     * Set the associated document type declaration node
     * @param {*} doctype node or assembler
     */
    set doctype(doctype) {
        if(doctype instanceof DocumentTypeAssembler) {
            doctype.parentNode = this.node
        }
        else {
            const node = this.node
            const firstChild = node.firstChild
            if(firstChild) {
                if(firstChild instanceof DocumentType) {
                    node.replaceChild(doctype, firstChild)
                }
                else node.insertBefore(doctype, firstChild)
            }
            else node.appendChild(doctype)
        }
    }

    /**
     * The associatied document type declaration node
     * @returns {DocumentTypeAssembler|null}
     */
    get doctype() {
        return this.getInstanceOf(this.node.doctype)
    }

    /**
     * Set the root document element
     * @param {*} documentElement node or assembler or init dictionary
     */
    set documentElement(documentElement) {
        const node = this.node
        const element = this.documentElement
        if(documentElement instanceof ElementAssembler) {
            if(element) element.remove()
            documentElement.parentNode = node
        }
        else if(documentElement instanceof Element) {
            if(element) element.remove()
            node.appendChild(documentElement)
        }
        else if(documentElement === null) {
            if(element) element.remove()
        }
        else {
            if(element) element.init(documentElement)
            else {
                const { elementAssembler } = this.constructor
                const element = new elementAssembler(documentElement)
                element.parentNode = node
            }
        }
    }

    /**
     * The root document element
     * @returns {ElementAssembler|null} Element
     */
    get documentElement() {
        return this.getInstanceOf(this.node.documentElement)
    }

    /**
     * Create a new Document node
     * @returns {Document|XMLDocument}
     * @override
     */
    static create() {
        return isConstructorSupported?
            new Document :
            implementation.createDocument(EMPTY_STRING, EMPTY_STRING, null)
    }

    /**
     * @returns {interface} Document
     * @override
     */
    static get interface() {
        return Document
    }
}

NodeAssembler.DocumentAssembler = DocumentAssembler 
