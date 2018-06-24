import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { DocumentType, document : { implementation } } = window
const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''

/**
 * @see https://www.w3.org/TR/dom/#interface-documenttype
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     * Create the specified DocumentType node
     * @returns {DocumentType}
     * @override
     */
    static create() {
        return implementation.createDocumentType(this.qualifiedName, this.publicId, this.systemId)
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
