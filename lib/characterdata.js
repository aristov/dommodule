import { NodeAssembler } from './node'

export class CharacterDataAssembler extends NodeAssembler {
    /**
     * Set character data of the node
     * @param {String} data
     */
    set data(data) {
        this.node.data = data
    }

    /**
     * Get character data of the node
     * @returns {String}
     */
    get data() {
        return this.node.data
    }
}

export class TextAssembler extends CharacterDataAssembler {
    /**
     * Create a new Text node and assign it to the assembler instance
     * @param {String} data
     * @returns {Text}
     */
    create(data) {
        return this.node = document.createTextNode(data)
    }

    /**
     * Remove all the adjacent Text nodes and set
     * the `wholeText` property value as a data of the node
     * @param {String} wholeText
     */
    set wholeText(wholeText) {
        let sibling = this.node
        while(sibling = sibling.previousSibling) {
            if(sibling instanceof Text) sibling.remove()
            else break
        }
        while(sibling = sibling.nextSibling) {
            if(sibling instanceof Text) sibling.remove()
            else break
        }
        this.data = wholeText
    }

    /**
     * Get the wholeText of the node
     * @returns {String}
     */
    get wholeText() {
        return this.node.wholeText
    }
}

export class CDATASectionAssembler extends TextAssembler {
    /**
     * Create a new CDATASection node and assign it to the assembler instance
     * @param {String} data
     * @returns {CDATASection}
     */
    create(data) {
        return this.node = document.createCDATASection(data)
    }
}

export class CommentAssembler extends CharacterDataAssembler {
    /**
     * Create a new Comment node and assign it to the assembler instance
     * @param {String} data
     * @returns {Comment}
     */
    create(data) {
        return this.node = document.createComment(data)
    }
}

export class ProcessingInstructionAssembler extends CharacterDataAssembler {
    /**
     * Create a new ProcessingInstruction node and assign it to the assembler instance
     * @param {String} target
     * @param {String} data
     * @returns {ProcessingInstruction}
     */
    create({ target, data }) {
        return this.node = document.createProcessingInstruction(target, data)
    }
}

/**
 * Text assembler factory
 * @param {{}|Node} [object]
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {TextAssembler}
 */
export function text(object, init) {
    return new TextAssembler(object, init)
}

/**
 * CDATASection assembler factory
 * @param {{}|Node} [object]
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {CDATASectionAssembler}
 */
export function cdata(object, init) {
    return new CDATASectionAssembler(object, init)
}

/**
 * Comment assembler factory
 * @param {{}|Node} [object]
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {CommentAssembler}
 */
export function comment(object, init) {
    return new CommentAssembler(object, init)
}

/**
 * ProcessingInstruction assembler factory
 * @param {{}|Node} [object]
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {ProcessingInstructionAssembler}
 */
export function instruction(object, init) {
    return new ProcessingInstructionAssembler(object, init)
}
