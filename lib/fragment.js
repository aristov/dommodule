import { ParentNodeAssembler } from './parentnode'

/**
 * DocumentFragment DOM node assembler
 */
export class DocumentFragmentAssembler extends ParentNodeAssembler {
    /**
     * Initialize the document fragment node with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Node|*} initialized node
     */
    init(init) {
        if(init.constructor !== Object) this.children = init
        else super.init(init)
    }
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
     * Create a new DocumentFragment node
     * @returns {DocumentFragment}
     */
    static create() {
        return this.document.createDocumentFragment()
    }
}

/**
 * DocumentFragment assembler factory
 * @param {{}|*} [init]
 * @returns {DocumentFragmentAssembler}
 */
export function fragment(init) {
    return new DocumentFragmentAssembler(init)
}
