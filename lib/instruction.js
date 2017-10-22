import { ProcessingInstruction, document } from './core'
import { CharacterDataAssembler } from './characterdata'

const PI_ATTRIBUTES_SEPARATOR = ' '
const PI_ATTRIBUTES_SEPARATOR_RE = /\s+/

const { keys } = Object

/**
 * ProcessingInstruction DOM node assembler
 */
export class ProcessingInstructionAssembler extends CharacterDataAssembler {
    /**
     * @param {{}} attrset
     */
    set attrset(attrset) {
        const handler = key => key + `="${ attrset[key] }"`
        this.data = keys(attrset).map(handler).join(PI_ATTRIBUTES_SEPARATOR)
    }

    /**
     * @returns {{}}
     */
    get attrset() {
        const data = this.data.split(PI_ATTRIBUTES_SEPARATOR_RE)
        return data.reduce((res, pair) => {
            const [key, value] = pair.split('=')
            if(key) res[key] = value.substr(1, value.length - 2)
            return res
        }, {})
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
        return this === ProcessingInstructionAssembler?
            instruction.name :
            this.name.toLowerCase()
    }

    /**
     * @returns {Function}
     */
    static get domInterface() {
        return ProcessingInstruction
    }
}

/**
 * ProcessingInstruction assembler factory (alias)
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {ProcessingInstructionAssembler}
 */
export function instruction(...init) {
    return new ProcessingInstructionAssembler(...init)
}
