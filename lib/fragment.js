import { NodeAssembler } from './node'

export class DocumentFragmentAssembler extends NodeAssembler {
    create() {
        return this.node = document.createDocumentFragment()
    }

    set children(children) {
        this.childNodes = children
    }

    get children() {
        return Array.from(this.node.children)
    }
}

export function fragment(init = {}) {
    return new DocumentFragmentAssembler(init.node || true, init)
}
