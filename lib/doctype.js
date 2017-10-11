import { implementation, TYPE_STRING } from './core'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'

const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''

/**
 * DocumentType DOM node assembler
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     *
     * @param init
     */
    init(init) {
        if(init.constructor === Object) super.init(init)
    }

    /**
     * Create the specified DocumentType node
     * @param {*} init
     * @returns {DocumentType}
     */
    static create(init) {
        if(typeof init === TYPE_STRING) {
            return implementation.createDocumentType(init, this.publicId, this.systemId)
        }
        else {
            const {
                qualifiedName = this.qualifiedName,
                publicId = this.publicId,
                systemId = this.systemId
            } = init || this
            return implementation.createDocumentType(qualifiedName, publicId, systemId)
        }
    }

    /**
     *
     * @returns {String}
     */
    static get qualifiedName() {
        return DocumentAssembler.qualifiedName
    }

    /**
     *
     * @returns {String}
     */
    static get publicId() {
        return DEFAULT_PUBLIC_ID
    }

    /**
     *
     * @returns {String}
     */
    static get systemId() {
        return DEFAULT_SYSTEM_ID
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
