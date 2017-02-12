import { NodeAssembler } from './node'

export class DocumentFragmentAssembler extends NodeAssembler {
    /**
     * Append children to the node
     * @param {*} children
     */
    set children(children) {
        this.childNodes = children
    }

    /**
     * Get children of the node
     * @returns {Array}
     */
    get children() {
        return Array.from(this.node.children)
    }

    /**
     * Instantiate a new DocumentFragment node
     * @returns {DocumentFragment}
     */
    static create() {
        return document.createDocumentFragment()
    }
}

/**
 * DocumentFragment assembler factory
 * @param {{}|*} init
 * @returns {DocumentFragmentAssembler}
 */
export function fragment(init = {}) {
    return new DocumentFragmentAssembler(init.node || true, init)
}
