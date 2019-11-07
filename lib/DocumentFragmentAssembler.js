import { NodeAssembler } from './NodeAssembler'
import { ParentNodeAssembler } from './ParentNodeAssembler'

const { DocumentFragment } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-documentfragment
 */
export class DocumentFragmentAssembler extends ParentNodeAssembler {
    /**
     * @returns {interface} DocumentFragment
     * @override
     */
    static get interface() {
        return DocumentFragment
    }
}

Object.defineProperty(NodeAssembler, 'DocumentFragmentAssembler', { value : DocumentFragmentAssembler })
