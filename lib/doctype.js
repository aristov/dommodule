import { TYPE_STRING } from './common'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'
import { NodeAssembler } from './node'

const { DocumentType, document : { implementation } } = window
const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''
const IGNORED_PROPERTY_NAMES = ['qualifiedName', 'publicId', 'systemId']

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-documenttype}
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     * @param {*} [init]
     * @override
     */
    create(init) {
        if(typeof init === TYPE_STRING) {
            init = { qualifiedName : init }
        }
        super.create(init)
    }

    /**
     * @param {String} name
     * @param {String} value
     */
    setProperty(name, value) {
        if(!IGNORED_PROPERTY_NAMES.includes(name)) {
            super.setProperty(name, value)
        }
    }

    /**
     * @param {ParentNodeAssembler|*} parentNode
     * @override
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
     * @override
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
     * @override
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
     * @override
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
