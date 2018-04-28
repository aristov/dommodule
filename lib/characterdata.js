import { TYPE_STRING } from './const'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { CharacterData } = window
const DATA_PROPERTY_NAME = 'data'
const DEFAULT_DATA = ''

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-characterdata}
 * @abstract
 */
export class CharacterDataAssembler extends ChildNodeAssembler {
    /**
     * Use the string type init as data
     * @param {*} init
     * @override
     */
    create(init) {
        super.create(typeof init === TYPE_STRING? { data : init } : init)
    }

    /**
     * @param {String} name
     * @param {String} value
     */
    setProperty(name, value) {
        if(name !== DATA_PROPERTY_NAME) {
            super.setProperty(name, value)
        }
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
     * @override
     */
    static get interface() {
        return CharacterData
    }
}

NodeAssembler.CharacterDataAssembler = CharacterDataAssembler
