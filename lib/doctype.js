import { TYPE_STRING } from './const'
import { DocumentType, document } from './dom'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'

const { implementation } = document
const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''

/**
 * DocumentType DOM node assembler
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     * @param {*} parentNode
     */
    set parentNode(parentNode) {
        if(parentNode instanceof DocumentAssembler) {
            parentNode.doctype = this
        }
        else {
            const node = this.node
            const firstChild = parentNode.firstChild
            if(firstChild) {
                if(firstChild instanceof DocumentType) {
                    parentNode.replaceChild(node, firstChild)
                }
                else parentNode.insertBefore(node, firstChild)
            }
            else parentNode.appendChild(node)
        }
    }

    /**
     * @returns {*}
     */
    get parentNode() {
        return super.parentNode
    }

    /**
     * @param {*} init
     * @returns {init}
     */
    create(init) {
        return typeof init === TYPE_STRING?
            super.create({ qualifiedName : init }) :
            super.create(init)
    }

    /**
     * Create the specified DocumentType node
     * @param {String} [qualifiedName]
     * @param {String} [publicId]
     * @param {String} [systemId]
     * @returns {DocumentType}
     */
    static create({
        qualifiedName = this.qualifiedName,
        publicId = this.publicId,
        systemId = this.systemId
    } = this) {
        return implementation.createDocumentType(qualifiedName, publicId, systemId)
    }

    /**
     * @returns {String}
     */
    static get qualifiedName() {
        return this === DocumentTypeAssembler?
            this.documentAssembler.qualifiedName :
            this.name.toLowerCase()
    }

    /**
     * @returns {String}
     */
    static get publicId() {
        return DEFAULT_PUBLIC_ID
    }

    /**
     * @returns {String}
     */
    static get systemId() {
        return DEFAULT_SYSTEM_ID
    }

    static get documentAssembler() {
        return DocumentAssembler
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return DocumentType
    }
}

/**
 * DocumentType assembler factory
 * @param {Node|{}|String} [init]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(...init) {
    return new DocumentTypeAssembler(...init)
}
