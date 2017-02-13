import { CharacterDataAssembler } from './characterdata'
import { DEFAULT_PI_TARGET } from './defaults'

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
    static create({ target = this.target, data }) {
        return this.document.createProcessingInstruction(target, data)
    }

    /**
     * The processing instruction target
     * @returns {String}
     */
    static get target() {
        return DEFAULT_PI_TARGET
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
