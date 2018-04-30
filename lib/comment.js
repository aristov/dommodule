import { CharacterDataAssembler } from './characterdata'
import { NodeAssembler } from './node'

const { Comment, document } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-comment
 */
export class CommentAssembler extends CharacterDataAssembler {
    /**
     * Create the specified Comment node
     * @param {String} data
     * @returns {Comment}
     * @override
     */
    static create({ data = this.data } = this) {
        return document.createComment(data)
    }

    /**
     * @returns {window.Comment}
     * @override
     */
    static get interface() {
        return Comment
    }
}

NodeAssembler.CommentAssembler = CommentAssembler

/**
 * Comment assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {CommentAssembler}
 */
export function comment(init) {
    return new CommentAssembler(init)
}
