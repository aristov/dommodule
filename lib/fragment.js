import { ParentNodeAssembler } from './parentnode'

const { DocumentFragment, document } = window

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-documentfragment}
 */
export class DocumentFragmentAssembler extends ParentNodeAssembler {
    /**
     * @returns {DocumentFragment}
     */
    static create(init) {
        return document.createDocumentFragment()
    }

    /**
     * @returns {window.DocumentFragment}
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
