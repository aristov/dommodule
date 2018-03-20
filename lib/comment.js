import { CharacterDataAssembler } from './characterdata'

const { Comment, document } = window

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-comment}
 */
export class CommentAssembler extends CharacterDataAssembler {
    /**
     * Create the specified Comment node
     * @param {String} data
     * @returns {Comment}
     */
    static create({ data = this.data } = this) {
        return document.createComment(data)
    }

    /**
     * @returns {window.Comment}
     */
    static get interface() {
        return Comment
    }
}

/**
 * Comment assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {CommentAssembler}
 */
export function comment(...init) {
    return new CommentAssembler(...init)
}
