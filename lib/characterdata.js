import { TYPE_STRING } from './const'
import { CharacterData } from './dom'
import { ChildNodeAssembler } from './childnode'

const DEFAULT_DATA = ''

/**
 * CharacterData DOM interface assembler
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
     * @returns {Function}
     */
    static get interface() {
        return CharacterData
    }
}
