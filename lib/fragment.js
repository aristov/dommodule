import { NodeAssembler } from './node'

export class DocumentFragmentAssembler extends NodeAssembler {
    /**
     * Instantiate a new DocumentFragment node
     * @returns {DocumentFragment}
     */
    create() {
        return this.node = document.createDocumentFragment()
    }

    /**
     * Set the children on the node
     * @param {*} children
     */
    set children(children) {
        this.childNodes = children
    }

    /**
     * Get the children of the node
     * @returns {Array}
     */
    get children() {
        return Array.from(this.node.children)
    }
}

/**
 * DocumentFragment assembler factory
 * @param {{}} init
 * @returns {DocumentFragmentAssembler}
 */
export function fragment(init = {}) {
    return new DocumentFragmentAssembler(init.node || true, init)
}
