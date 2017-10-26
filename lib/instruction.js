import { ProcessingInstruction, document } from './dom'
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
        const result = []
        keys(attrset).forEach(key => {
            if(key) result.push(key + `="${ attrset[key] }"`)
        })
        this.data = result.join(PI_ATTRIBUTES_SEPARATOR)
    }

    /**
     * @returns {{}}
     */
    get attrset() {
        const data = this.data.split(PI_ATTRIBUTES_SEPARATOR_RE)
        return data.reduce((res, pair) => {
            const [key, value] = pair.split('=')
            res[key] = value.substr(1, value.length - 2)
            return res
        }, {})
    }

    /**
     * Create the specified ProcessingInstruction node
     * @param {String} [target]
     * @param {String} [data]
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
    static get interface() {
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
