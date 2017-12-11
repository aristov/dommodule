import { ParentNodeAssembler } from './parentnode'

const { DocumentFragment, document } = window

/**
 * DocumentFragment DOM node assembler
 */
export class DocumentFragmentAssembler extends ParentNodeAssembler {
    /**
     * Create a new DocumentFragment node
     * @returns {DocumentFragment}
     */
    static create(init) {
        return document.createDocumentFragment()
    }

    /**
     * @returns {Function}
     */
    static get interface() {
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
