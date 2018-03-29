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

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-document}
 */
export class DocumentAssembler extends ParentNodeAssembler {
    /**
     * @param {String} id
     * @returns {ElementAssembler}
     */
    getElementById(id) {
        return this.getInstanceOf(this.node.getElementById(id), this.constructor.elementAssembler)
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
     * @returns {DocumentTypeAssembler|DocumentAssembler.doctypeAssembler|null}
     */
    get doctype() {
        return this.getInstanceOf(this.node.doctype, this.constructor.doctypeAssembler)
    }

    /**
     * Set the root document element
     * @param {*} documentElement node or assembler or init dictionary
     */
    set documentElement(documentElement) {
        const node = this.node
        const element = this.documentElement
        if(documentElement instanceof ElementAssembler) {
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
     * @returns {ElementAssembler|DocumentAssembler.elementAssembler|null} Element
     */
    get documentElement() {
        this.getInstanceOf(this.node.documentElement, this.constructor.elementAssembler)
    }

    /**
     * Create a new Document node
     * @returns {Document}
     * @override
     */
    static create() {
        return new Document
    }

    /**
     * @returns {window.Document}
     * @override
     */
    static get interface() {
        return Document
    }
}

NodeAssembler.DocumentAssembler = DocumentAssembler 
