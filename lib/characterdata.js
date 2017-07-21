import { ChildNodeAssembler } from './childnode'
import { TYPE_STRING } from './core'

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
        if(data !== this.data) this.node.data = data
    }

    /**
     * Get character data of the node
     * @returns {String}
     */
    get data() {
        return this.node.data
    }
}
