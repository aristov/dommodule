import { Node } from './dom'
import { EventTargetAssembler } from './eventtarget'
// import { AttrAssembler } from './attr'
// import { CommentAssembler } from './comment'
// import { DocumentTypeAssembler } from './doctype'
// import { DocumentAssembler } from './document'
// import { ElementAssembler } from './element'
// import { DocumentFragmentAssembler } from './fragment'
// import { ProcessingInstructionAssembler } from './instruction'
// import { TextAssembler } from './text'

/**
 * Node DOM interface assembler
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {*} init
     * @returns {Node|*}
     */
    assemble(init) {
        if(init && init.constructor === Object && init.node instanceof Node) {
            this.node = init.node
            this.init(init)
        }
        else super.assemble(init)
        return this.node
    }

    /**
     * @param {Node|*} node
     */
    set node(node) {
        if(node !== this.node) {
            const constructor = this.constructor
            if(node instanceof constructor.interface) this.setInstance(node)
            else {
                const message = `Failed to set 'node' on '${ constructor.name }': parameter is not of expected type.`
                throw TypeError(message)
            }
        }
    }

    /**
     * @returns {Node|*}
     */
    get node() {
        return this._target
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return Node
    }

    /*static get attrAssembler() {
        return AttrAssembler
    }

    static get elementAssembler() {
        return ElementAssembler
    }

    static get commentAssembler() {
        return CommentAssembler
    }

    static get documentTypeAssembler() {
        return DocumentTypeAssembler
    }

    static get documentAssembler() {
        return DocumentAssembler
    }

    static get documentFragmentAssembler() {
        return DocumentFragmentAssembler
    }

    static get processingInstructionAssembler() {
        return ProcessingInstructionAssembler
    }

    static get textAssembler() {
        return TextAssembler
    }

    static get nodeTypeMap() {
        return {
            [Node.ATTRIBUTE_NODE] : this.attrAssembler,
            [Node.ELEMENT_NODE] : this.elementAssembler,
            [Node.COMMENT_NODE] : this.commentAssembler,
            [Node.DOCUMENT_FRAGMENT_NODE] : this.documentFragmentAssembler,
            [Node.DOCUMENT_NODE] : this.documentAssembler,
            [Node.DOCUMENT_TYPE_NODE] : this.documentTypeAssembler,
            [Node.PROCESSING_INSTRUCTION_NODE] : this.processingInstructionAssembler,
            [Node.TEXT_NODE] : this.textAssembler,
        }
    }*/
}
