import { INSTANCE_PROPERTY_NAME } from './const'
import { AttrAssembler } from './attr'
import { CommentAssembler } from './comment'
import { DocumentAssembler } from './document'
import { DocumentFragmentAssembler } from './fragment'
import { DocumentTypeAssembler } from './doctype'
import { ElementAssembler } from './element'
import { ProcessingInstructionAssembler } from './instruction'
import { TextAssembler } from './text'

const { Node } = window

const nodeTypeMap = {
    [Node.ATTRIBUTE_NODE] : AttrAssembler,
    [Node.ELEMENT_NODE] : ElementAssembler,
    [Node.COMMENT_NODE] : CommentAssembler,
    [Node.DOCUMENT_FRAGMENT_NODE] : DocumentFragmentAssembler,
    [Node.DOCUMENT_NODE] : DocumentAssembler,
    [Node.DOCUMENT_TYPE_NODE] : DocumentTypeAssembler,
    [Node.PROCESSING_INSTRUCTION_NODE] : ProcessingInstructionAssembler,
    [Node.TEXT_NODE] : TextAssembler,
}

Object.defineProperty(Node.prototype, INSTANCE_PROPERTY_NAME, {
    configurable : true,
    get() {
        const assembler = nodeTypeMap[this.nodeType]
        return this[INSTANCE_PROPERTY_NAME] = new assembler({ node : this })
    },
    set(value) {
        Object.defineProperty(this, INSTANCE_PROPERTY_NAME, {
            // configurable : true,
            writable : true,
            value
        })
    }
})

/*const {
 ATTRIBUTE_NODE,
 COMMENT_NODE,
 DOCUMENT_FRAGMENT_NODE,
 DOCUMENT_NODE,
 DOCUMENT_TYPE_NODE,
 ELEMENT_NODE,
 PROCESSING_INSTRUCTION_NODE,
 TEXT_NODE
 } = Node*/
