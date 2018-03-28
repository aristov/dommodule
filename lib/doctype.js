import { TYPE_STRING } from './const'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'
import { NodeAssembler } from './node'

const { DocumentType, document : { implementation } } = window
const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-documenttype}
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     * @param {*} [init]
     */
    create(init) {
        if(typeof init === TYPE_STRING) {
            super.create({ qualifiedName : init })
        }
        else super.create(init)
    }

    /**
     * @param {ParentNodeAssembler|*} parentNode
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
     * @returns {window.DocumentType}
     */
    static get interface() {
        return DocumentType
    }

    /**
     * @returns {String}
     */
    static get qualifiedName() {
        return this.documentAssembler.elementAssembler.qualifiedName
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
}

NodeAssembler.DocumentTypeAssembler = DocumentTypeAssembler

/**
 * DocumentType assembler factory
 * @param {Node|{}|String} [init]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(...init) {
    return new DocumentTypeAssembler(...init)
}
