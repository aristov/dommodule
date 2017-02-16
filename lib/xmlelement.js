import { ElementAssembler } from './element'
import {
    XML_NAMESPACE_URI as NSURI,
    XML_NAMESPACE_PREFIX as PREFIX,
    NAMESPACE_SEPARATOR as DELIM
} from './defaults'

const XML_LANG_ATTRIBUTE_NAME = PREFIX + DELIM + 'lang'
const XML_SPACE_ATTRIBUTE_NAME = PREFIX + DELIM + 'space'

export class XMLElementAssembler extends ElementAssembler {
    /**
     * xml:lang
     * @param {String} lang
     */
    set lang(lang) {
        this.node.setAttributeNS(NSURI, XML_LANG_ATTRIBUTE_NAME, lang)
    }

    /**
     *
     * @returns {String}
     */
    get lang() {
        return this.node.getAttributeNS(NSURI, XML_LANG_ATTRIBUTE_NAME)
    }

    /**
     *
     * @param {String} space
     */
    set space(space) {
        this.node.setAttributeNS(NSURI, XML_SPACE_ATTRIBUTE_NAME, space)
    }

    /**
     *
     * @returns {String}
     */
    get space() {
        return this.node.getAttributeNS(NSURI, XML_SPACE_ATTRIBUTE_NAME)
    }
}

/**
 *
 * @param {*} init
 * @returns {XMLElementAssembler}
 */
export function xml(init) {
    return new XMLElementAssembler(init)
}
