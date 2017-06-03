import { CharacterDataAssembler } from './characterdata'
import {
    TYPE_STRING,
    PI_ATTRIBUTES_SEPARATOR,
    DEFAULT_PI_TARGET,
    DEFAULT_PI_DATA
} from './defaults'

const keys = Object.keys

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
        else {
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
     * Create a new ProcessingInstruction node and assign it to the assembler instance
     * @param {String} target
     * @param {String} data
     * @returns {ProcessingInstruction}
     */
    static create({
        target = this.target, 
        data = this.data
    } = this) {
        return this.document.createProcessingInstruction(target, data)
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
