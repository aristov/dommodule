import { Comment, document } from './core'
import { CharacterDataAssembler } from './characterdata'

/**
 * Comment DOM node assembler
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
     * @returns {Function}
     */
    static get domInterface() {
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
