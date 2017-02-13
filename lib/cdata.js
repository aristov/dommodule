import { TextAssembler } from './text'

export class CDATASectionAssembler extends TextAssembler {
    /**
     * Create a new CDATASection node and assign it to the assembler instance
     * @param {String} data
     * @returns {CDATASection}
     */
    static create({ data }) {
        return this.document.createCDATASection(data)
    }
}

/**
 * CDATASection assembler factory
 * @param {{}|Node|String|NodeAssembler|Array} [init]
 * @returns {CDATASectionAssembler}
 */
export function cdata(init) {
    return new CDATASectionAssembler(init)
}
