import { CharacterDataAssembler } from './characterdata'
import { DEFAULT_PI_TARGET, DEFAULT_PI_DATA } from './defaults'

/**
 * ProcessingInstruction DOM node assembler
 */
export class ProcessingInstructionAssembler extends CharacterDataAssembler {
    /**
     * Create a new ProcessingInstruction node and assign it to the assembler instance
     * @param {String} target
     * @param {String} data
     * @returns {ProcessingInstruction}
     */
    static create({ target = this.target, data = this.data } = this) {
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
 * ProcessingInstruction assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {ProcessingInstructionAssembler}
 */
export function instruction(init) {
    return new ProcessingInstructionAssembler(init)
}
