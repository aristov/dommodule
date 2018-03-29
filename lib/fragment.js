import { NodeAssembler } from './node'
import { ParentNodeAssembler } from './parentnode'

const { DocumentFragment, document } = window

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-documentfragment}
 */
export class DocumentFragmentAssembler extends ParentNodeAssembler {
    /**
     * @returns {DocumentFragment}
     * @override
     */
    static create(init) {
        return document.createDocumentFragment()
    }

    /**
     * @returns {window.DocumentFragment}
     * @override
     */
    static get interface() {
        return DocumentFragment
    }
}

NodeAssembler.DocumentFragmentAssembler = DocumentFragmentAssembler

/**
 * DocumentFragment assembler factory
 * @param {{}|*} [init]
 * @returns {DocumentFragmentAssembler}
 */
export function fragment(...init) {
    return new DocumentFragmentAssembler(...init)
}
