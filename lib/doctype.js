import { ChildNodeAssembler } from './childnode'

const impl = window.document.implementation

import {
    DEFAULT_DOCUMENT_NAME,
    DEFAULT_PUBLIC_ID,
    DEFAULT_SYSTEM_ID
} from './const'

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
        if(typeof init === 'string') {
            return impl.createDocumentType(init, this.publicId, this.systemId)
        }
        else {
            const {
                qualifiedName = this.qualifiedName,
                publicId = this.publicId,
                systemId = this.systemId
            } = init || this
            return impl.createDocumentType(qualifiedName, publicId, systemId)
        }
    }

    /**
     *
     * @returns {String}
     */
    static get qualifiedName() {
        return DEFAULT_DOCUMENT_NAME
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
export function doctype(init) {
    return new DocumentTypeAssembler(init)
}
