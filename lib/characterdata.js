import { TYPE_STRING } from './common'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { CharacterData } = window
const DATA_PROPERTY_NAME = 'data'
const DEFAULT_DATA = ''

/**
 * @see https://www.w3.org/TR/dom/#interface-characterdata
 * @abstract
 */
export class CharacterDataAssembler extends ChildNodeAssembler {
    /**
     * Use the string type init as data
     * @param {*} [init]
     * @override
     */
    create(init) {
        if(typeof init === TYPE_STRING) {
            init = { data : init }
        } 
        super.create(init)
    }

    /**
     * @param {string} name
     * @param {string} value
     */
    setProperty(name, value) {
        if(name !== DATA_PROPERTY_NAME) {
            super.setProperty(name, value)
        }
    }

    /**
     * Set character data of the node
     * @param {string} data
     */
    set data(data) {
        this.node.data = data
    }

    /**
     * Get character data of the node
     * @returns {string}
     */
    get data() {
        return this.node.data
    }

    /**
     * @returns {string}
     */
    static get data() {
        return DEFAULT_DATA
    }

    /**
     * @returns {interface} CharacterData
     * @override
     */
    static get interface() {
        return CharacterData
    }
}

NodeAssembler.CharacterDataAssembler = CharacterDataAssembler
