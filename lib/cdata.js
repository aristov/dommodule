import { document } from './core'
import { TextAssembler } from './text'

/**
 * CDATASection DOM node assembler
 */
export class CDATASectionAssembler extends TextAssembler {
    /**
     * Create the specified CDATASection node
     * @param {String} data
     * @returns {CDATASection}
     */
    static create({ data }) {
        return document.createCDATASection(data)
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
