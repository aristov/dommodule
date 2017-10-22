import { DocumentFragment, document } from './core'
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
        if(init) {
            if(init.constructor === Object) super.init(init)
            else this.children = init
        }
    }
    /**
     * Append children to the node
     * @param {*} children
     */
    set children(children) {
        this.childNodes = children
    }

    /**
     * Get all children of the node as an array
     * @returns {Array}
     */
    get children() {
        return Array.from(this.node.children).map(node => {
            return this.getInstance(node)
        })
    }

    /**
     * Create a new DocumentFragment node
     * @returns {DocumentFragment}
     */
    static create() {
        return document.createDocumentFragment()
    }

    /**
     * @returns {Function}
     */
    static get domInterface() {
        return DocumentFragment
    }
}

/**
 * DocumentFragment assembler factory
 * @param {{}|*} [init]
 * @returns {DocumentFragmentAssembler}
 */
export function fragment(...init) {
    return new DocumentFragmentAssembler(...init)
}
