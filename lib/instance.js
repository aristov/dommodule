import { INSTANCE_PROPERTY_NAME } from './const'
import { AttrAssembler } from './attr'
import { CommentAssembler } from './comment'
import { DocumentAssembler } from './document'
import { DocumentFragmentAssembler } from './fragment'
import { DocumentTypeAssembler } from './doctype'
import { ElementAssembler } from './element'
import { ProcessingInstructionAssembler } from './instruction'
import { TextAssembler } from './text'

const { defineProperty } = Object
const { Node } = window

export const nodeTypeMap = {
    [Node.ATTRIBUTE_NODE] : AttrAssembler,
    [Node.ELEMENT_NODE] : ElementAssembler,
    [Node.COMMENT_NODE] : CommentAssembler,
    [Node.DOCUMENT_FRAGMENT_NODE] : DocumentFragmentAssembler,
    [Node.DOCUMENT_NODE] : DocumentAssembler,
    [Node.DOCUMENT_TYPE_NODE] : DocumentTypeAssembler,
    [Node.PROCESSING_INSTRUCTION_NODE] : ProcessingInstructionAssembler,
    [Node.TEXT_NODE] : TextAssembler
}

/*defineProperty(Node.prototype, INSTANCE_PROPERTY_NAME, {
    configurable : true,
    get() {
        const assembler = nodeTypeMap[this.nodeType]
        return this[INSTANCE_PROPERTY_NAME] = new assembler({ node : this })
    },
    set(value) {
        defineProperty(this, INSTANCE_PROPERTY_NAME, { writable : true, value })
    }
})

/!*
 * This is a workaround for the JSDOM's issue #1641:
 *  https://github.com/tmpvar/jsdom/issues/1641
 * todo: remove when the problem is solved
 *!/
defineProperty(window.Attr.prototype, INSTANCE_PROPERTY_NAME, {
    configurable : true,
    get() {
        return this[INSTANCE_PROPERTY_NAME] = new AttrAssembler({ node : this })
    },
    set(value) {
        defineProperty(this, INSTANCE_PROPERTY_NAME, { writable : true, value })
    }
})*/

defineProperty(Node.prototype, INSTANCE_PROPERTY_NAME, {
    configurable : true,
    writable : true,
    value : null
})
defineProperty(window.Attr.prototype, INSTANCE_PROPERTY_NAME, {
    configurable : true,
    writable : true,
    value : null
})
