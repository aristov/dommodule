import { CharacterDataAssembler } from './characterdata'

const { Text, document } = window

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-text}
 */
export class TextAssembler extends CharacterDataAssembler {
    /**
     * @param {String} data
     * @returns {Text}
     */
    static create({ data = this.data } = this) {
        return document.createTextNode(data)
    }

    /**
     * @returns {window.Text}
     */
    static get interface() {
        return Text
    }
}

/**
 * Text assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {TextAssembler}
 */
export function text(...init) {
    return new TextAssembler(...init)
}
