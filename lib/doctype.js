import { TYPE_STRING } from './common'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'
import { NodeAssembler } from './node'

const { DocumentType, document : { implementation } } = window
const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''
const IGNORED_PROPERTY_NAMES = ['qualifiedName', 'publicId', 'systemId']

/**
 * @see https://www.w3.org/TR/dom/#interface-documenttype
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
     * @param {string} name
     * @param {string} value
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
     * @param {{}} [init]
     * @returns {DocumentType}
     * @override
     */
    static create(init) {
        const {
            qualifiedName = this.qualifiedName,
            publicId = this.publicId,
            systemId = this.systemId
        } = init || this
        return implementation.createDocumentType(qualifiedName, publicId, systemId)
    }

    /**
     * @returns {interface} DocumentType
     * @override
     */
    static get interface() {
        return DocumentType
    }

    /**
     * @returns {string}
     */
    static get qualifiedName() {
        return this.documentAssembler.elementAssembler.qualifiedName
    }

    /**
     * @returns {string}
     */
    static get publicId() {
        return DEFAULT_PUBLIC_ID
    }

    /**
     * @returns {string}
     */
    static get systemId() {
        return DEFAULT_SYSTEM_ID
    }
}

NodeAssembler.DocumentTypeAssembler = DocumentTypeAssembler

/**
 * DocumentType assembler factory
 * @param {*} [init]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(init) {
    return new DocumentTypeAssembler(init)
}
