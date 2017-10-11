import { document, TYPE_STRING } from './core'
import { CharacterDataAssembler } from './characterdata'

const DEFAULT_PI_TARGET = 'target'
const DEFAULT_PI_DATA = 'data'
const PI_ATTRIBUTES_SEPARATOR = ' '

const { keys } = Object

/**
 * ProcessingInstruction DOM node assembler
 */
export class ProcessingInstructionAssembler extends CharacterDataAssembler {
    /**
     * Set the data on the PI node
     * @param {String} data {String|{}} data string or attributes dictionary
     */
    set data(data) {
        if(typeof data === TYPE_STRING) super.data = data
        else if(data && data.constructor === Object) {
            const handler = key => key + `="${ data[key] }"`
            super.data = keys(data).map(handler).join(PI_ATTRIBUTES_SEPARATOR)
        }
    }

    /**
     * Get the data of the PI node
     * @returns {String}
     */
    get data() {
        return super.data
    }

    /**
     * Create the specified ProcessingInstruction node
     * @param {String} target
     * @param {String} data
     * @returns {ProcessingInstruction}
     */
    static create({
        target = this.target, 
        data = this.data
    } = this) {
        return document.createProcessingInstruction(target, data)
    }

    /**
     * The processing instruction default target
     * @returns {String}
     */
    static get target() {
        return DEFAULT_PI_TARGET
    }

    /**
     * The processing instruction default data
     * @returns {String}
     */
    static get data() {
        return DEFAULT_PI_DATA
    }
}

/**
 * ProcessingInstruction assembler factory (alias)
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {ProcessingInstructionAssembler}
 */
export function instruction(init) {
    return new ProcessingInstructionAssembler(init)
}
