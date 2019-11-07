import { ChildNodeAssembler } from './ChildNodeAssembler'
import { NodeAssembler } from './NodeAssembler'

const { CharacterData } = window
const DATA_PROPERTY_NAME = 'data'
const EMPTY_STRING = ''

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
     * @override
     */
    static create() {
        return new this.interface(this.data)
    }

    /**
     * @returns {string}
     */
    static get data() {
        return EMPTY_STRING
    }

    /**
     * @returns {string}
     * @override
     */
    static get valuePropertyName() {
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
