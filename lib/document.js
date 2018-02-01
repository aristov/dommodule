import { ElementAssembler } from './element'
import { DocumentTypeAssembler } from './doctype'
import { ParentNodeAssembler } from './parentnode'

const {
    Document,
    DocumentType,
    Element,
    document : { implementation }
} = window
const DEFAULT_DOCTYPE = null
const DEFAULT_QUALIFIED_NAME = 'document'

/**
 * Document DOM node assembler
 */
export class DocumentAssembler extends ParentNodeAssembler {
    /**
     * @param {String} id
     * @returns {ElementAssembler}
     */
    getElementById(id) {
        const node = this.node.getElementById(id)
        const assembler = this.constructor.elementAssembler
        return this.getInstance(node, assembler)
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
        const doctypeNode = this.node.doctype
        if(doctypeNode) {
            const { doctypeAssembler } = this.constructor
            return this.getInstance(doctypeNode, doctypeAssembler)
        }
        else return null
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
        else if(documentElement === null && element) {
            element.remove()
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
        const elementNode = this.node.documentElement
        if(elementNode) {
            const { elementAssembler } = this.constructor
            return this.getInstance(elementNode, elementAssembler)
        }
        else return null
    }

    /**
     * Create the specified Document node
     * @param {*} [init]
     * @returns {Document}
     */
    static create(init) {
        const {
            namespace = this.namespace,
            qualifiedName = this.qualifiedName,
            doctype = this.doctype
        } = init || this
        return implementation.createDocument(
            namespace,
            qualifiedName,
            doctype instanceof DocumentTypeAssembler?
                doctype.node :
                doctype)
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
    static get doctypeAssembler() {
        return DocumentTypeAssembler
    }

    /**
     * @returns {Function}
     */
    static get elementAssembler() {
        return ElementAssembler
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return Document
    }

    /**
     * The default namespace URI
     * @returns {String}
     */
    static get namespace() {
        return this.elementAssembler.namespace
    }

    /**
     * The qualified name of the document element node
     * @returns {String}
     */
    static get qualifiedName() {
        return this === DocumentAssembler?
            DEFAULT_QUALIFIED_NAME :
            this.elementAssembler.qualifiedName
    }
}
