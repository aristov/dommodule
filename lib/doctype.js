import { NodeAssembler } from './node'

const impl = window.document.implementation

export class DocumentTypeAssembler extends NodeAssembler {
    create({ name, publicId, systemId }) {
        return this.node = impl.createDocument(name, publicId, systemId)
    }
}

export function doctype(init) {
    const assembler = new DocumentTypeAssembler()
    assembler.create(typeof init === 'string'? { name : init } : init)
}
