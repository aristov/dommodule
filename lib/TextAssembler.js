import { CharacterDataAssembler } from './CharacterDataAssembler'
import { NodeAssembler } from './NodeAssembler'

const { Text } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-text
 */
export class TextAssembler extends CharacterDataAssembler {
    /**
     * @returns {interface} Text
     * @override
     */
    static get interface() {
        return Text
    }
}

NodeAssembler.TextAssembler = TextAssembler
