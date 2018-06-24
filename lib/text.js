import { CharacterDataAssembler } from './characterdata'
import { NodeAssembler } from './node'

const { Text, document } = window

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

/**
 * Text assembler factory
 * @param {*} [init]
 * @returns {TextAssembler}
 */
export function text(init) {
    return new TextAssembler(init)
}
