import { document, Text } from './core'
import { CharacterDataAssembler } from './characterdata'

/**
 * Text DOM node assembler
 */
export class TextAssembler extends CharacterDataAssembler {
    /**
     * Remove all the adjacent Text nodes and set
     * the `wholeText` property value as a data of the node
     * @param {String} wholeText
     */
    set wholeText(wholeText) {
        let sibling = this.node
        while(sibling = sibling.previousSibling) {
            if(sibling instanceof Text) sibling.remove()
            else break
        }
        while(sibling = sibling.nextSibling) {
            if(sibling instanceof Text) sibling.remove()
            else break
        }
        this.data = wholeText
    }

    /**
     * Get the wholeText of the node
     * @returns {String}
     */
    get wholeText() {
        return this.node.wholeText
    }

    /**
     * Create the specified Text node
     * @param {String} data
     * @returns {Text}
     */
    static create({ data }) {
        return document.createTextNode(data)
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
