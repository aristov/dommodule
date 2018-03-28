import { TYPE_STRING } from './const'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { CharacterData } = window
const DEFAULT_DATA = ''

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-characterdata}
 */
export class CharacterDataAssembler extends ChildNodeAssembler {
    /**
     * Use the string type init as data
     * @param {*} init
     */
    assemble(init) {
        return typeof init === TYPE_STRING?
            this.node = this.constructor.create({ data : init }) :
            super.assemble(init)
    }

    /**
     * Set character data of the node
     * @param {String} data
     */
    set data(data) {
        this.node.data = data
    }

    /**
     * Get character data of the node
     * @returns {String}
     */
    get data() {
        return this.node.data
    }

    /**
     * @returns {String}
     */
    static get data() {
        return DEFAULT_DATA
    }

    /**
     * @returns {window.CharacterData}
     */
    static get interface() {
        return CharacterData
    }
}

NodeAssembler.CharacterDataAssembler = CharacterDataAssembler
