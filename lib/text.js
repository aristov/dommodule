import { Text, document } from './dom'
import { CharacterDataAssembler } from './characterdata'

/**
 * Text DOM node assembler
 */
export class TextAssembler extends CharacterDataAssembler {
    /**
     * Create the specified Text node
     * @param {String} data
     * @returns {Text}
     */
    static create({ data = this.data } = this) {
        return document.createTextNode(data)
    }

    /**
     * @returns {Function}
     */
    static get domInterface() {
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
