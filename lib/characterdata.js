import { ChildNodeAssembler } from './childnode'

export class CharacterDataAssembler extends ChildNodeAssembler {
    /**
     * Use the string type init as data
     * @param {*} init
     */
    assemble(init) {
        if(typeof init === 'string') init = { data : init }
        return super.assemble(init)
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
}
