import { ChildNodeAssembler } from './ChildNodeAssembler'
import { NodeAssembler } from './NodeAssembler'

const { DocumentType, document : { implementation } } = window
const EMPTY_STRING = ''

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
        return EMPTY_STRING
    }

    /**
     * @returns {string}
     */
    static get systemId() {
        return EMPTY_STRING
    }
}

Object.defineProperty(NodeAssembler, 'DocumentTypeAssembler', { value : DocumentTypeAssembler })
