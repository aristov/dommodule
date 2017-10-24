/**
 * https://www.w3.org/TR/REC-xml-names/
 */

import { AttrAssembler } from '../lib/attr'

const NAMESPACE_URI = 'http://www.w3.org/2000/xmlns/'
const PREFIX = 'xmlns'

export class XMLNSAttrAssembler extends AttrAssembler {
    create(init) {
        return !init || typeof init === 'string'?
            super.create({ prefix : null, name : 'xmlns' }) :
            super.create(init)
    }

    /**
     *
     * @returns {String}
     */
    static get prefix() {
        return PREFIX
    }

    /**
     *
     * @returns {String}
     */
    static get namespaceURI() {
        return NAMESPACE_URI
    }
}

/**
 *
 * @param {*} init
 * @returns {XMLNSAttrAssembler}
 */
export function xmlns(...init) {
    return new XMLNSAttrAssembler(...init)
}
