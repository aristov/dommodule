import { CharacterDataAssembler } from './characterdata'
import { NodeAssembler } from './node'

const { Text, document } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-text
 */
export class TextAssembler extends CharacterDataAssembler {
    /**
     * @param {String} data
     * @returns {Text}
     * @override
     */
    static create({ data = this.data } = this) {
        return document.createTextNode(data)
    }

    /**
     * @returns {window.Text}
     * @override
     */
    static get interface() {
        return Text
    }
}

NodeAssembler.TextAssembler = TextAssembler

/**
 * Text assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {TextAssembler}
 */
export function text(init) {
    return new TextAssembler(init)
}
