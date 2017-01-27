import { NodeAssembler } from './node'

const impl = window.document.implementation

export class DocumentTypeAssembler extends NodeAssembler {
    /**
     * Instantiate the new DocumentType node
     * @param {*} descriptor
     * @returns {DocumentType}
     */
    create(descriptor = {}) {
        if(typeof descriptor === 'string') descriptor = { name : descriptor }
        //noinspection JSCheckFunctionSignatures
        return this.node = impl.createDocumentType(
            descriptor.name,
            descriptor.publicId || '',
            descriptor.systemId || '')
    }
}

/**
 * DocumentType assembler factory
 * @param {{}|Node} [object]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(object) {
    return new DocumentTypeAssembler(object)
}
