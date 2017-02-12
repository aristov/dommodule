import { NodeAssembler } from './node'

const impl = window.document.implementation

export class DocumentTypeAssembler extends NodeAssembler {
    /**
     * Instantiate the specified DocumentType node
     * @param init
     * @returns {*}
     */
    instantiate(init) {
        if(init && 'node' in init) return super.instantiate(init)
        else return this.node = this.constructor.create(init)
    }

    /**
     * Create the specified DocumentType node
     * @param {*} init
     * @returns {DocumentType}
     */
    static create (init) {
        if(typeof init === 'string') init = { name : init }
        //noinspection JSCheckFunctionSignatures
        return impl.createDocumentType(
            init.name,
            init.publicId || '',
            init.systemId || '')
    }
}

/**
 * DocumentType assembler factory
 * @param {{}|Node} [init]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(init) {
    return new DocumentTypeAssembler(init)
}
