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
     * @returns {CharacterData|*}
     */
    static create() {
        return new this.interface(this.data)
    }

    /**
     * @returns {string}
     */
    static get data() {
        return DEFAULT_DATA
    }

    /**
     * @returns {string}
     */
    static get defaultPropertyName() {
        return DATA_PROPERTY_NAME
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
