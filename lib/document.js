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
        this.prepend(doctype)
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
        const _documentElement = this.documentElement
        if(documentElement instanceof ElementAssembler
            || documentElement instanceof Element
            || documentElement === null) {
            _documentElement && _documentElement.remove()
            documentElement && this.append(documentElement)
        }
        else if(_documentElement) {
            _documentElement.init(documentElement)
        }
        else this.append(new this.constructor.elementAssembler(documentElement))
    }

    /**
     * The root document element
     * @returns {ElementAssembler|null} Element
     */
    get documentElement() {
        return this.getInstanceOf(this.node.documentElement)
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
