import { CharacterDataAssembler } from './characterdata'

/**
 * Comment DOM node assembler
 */
export class CommentAssembler extends CharacterDataAssembler {
    /**
     * Create a new Comment node and assign it to the assembler instance
     * @param {String} data
     * @returns {Comment}
     */
    static create({ data }) {
        return this.document.createComment(data)
    }
}

/**
 * Comment assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {CommentAssembler}
 */
export function comment(init) {
    return new CommentAssembler(init)
}
