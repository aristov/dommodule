import { NodeAssembler } from './node'

const impl = window.document.implementation

export class DocumentTypeAssembler extends NodeAssembler {
    create(descriptor = {}) {
        if(typeof descriptor === 'string') descriptor = { name : descriptor }
        //noinspection JSCheckFunctionSignatures
        return this.node = impl.createDocumentType(
            descriptor.name,
            descriptor.publicId || '',
            descriptor.systemId || '')
    }
}

export function doctype(object) {
    return new DocumentTypeAssembler(object)
}
