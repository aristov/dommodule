import { NodeAssembler } from './node'

const impl = window.document.implementation

export class DocumentTypeAssembler extends NodeAssembler {
    create(object = {}) {
        if(typeof object === 'string') object = { name : object }
        return this.node = impl.createDocumentType(object.name, object.publicId || '', object.systemId || '')
    }
}

export function doctype(init) {
    const assembler = new DocumentTypeAssembler()
    return assembler.create(init)
}
