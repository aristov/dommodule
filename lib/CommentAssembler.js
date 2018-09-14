import { CharacterDataAssembler } from './CharacterDataAssembler'
import { NodeAssembler } from './NodeAssembler'

const { Comment } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-comment
 */
export class CommentAssembler extends CharacterDataAssembler {
    /**
     * @returns {interface} Comment
     * @override
     */
    static get interface() {
        return Comment
    }
}

NodeAssembler.CommentAssembler = CommentAssembler
