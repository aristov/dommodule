import { NodeAssembler } from './node'

export class DocumentFragmentAssembler extends NodeAssembler {
    create() {
        return this.node = new DocumentFragment()
    }

    set children(children) {
        this.childNodes = children
    }

    get children() {
        return Array.from(this.node.children)
    }
}

export function fragment(init) {
    const assembler = new DocumentFragmentAssembler()
    assembler.create()
    if(init) assembler.init(init)
    return assembler
}
