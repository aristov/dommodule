import { AttrAssembler } from './attr'
import { ElementAssembler } from './element'
import { XML_NAMESPACE_URI, XML_NAMESPACE_PREFIX } from './defaults'

export class XMLAttrAssembler extends AttrAssembler {
    static get namespaceURI() {
        return XML_NAMESPACE_URI
    }
    static get prefix() {
        return XML_NAMESPACE_PREFIX
    }
    static get qualifiedName() {
        return super.qualifiedName
    }
}

/*================================================================*/

export class Lang extends XMLAttrAssembler {}

export function lang(init) {
    return new Lang(init)
}

/*================================================================*/

export class Space extends XMLAttrAssembler {}

export function space(init) {
    return new Space(init)
}

/*================================================================*/

export class XMLElementAssembler extends ElementAssembler {
    /**
     * xml:lang
     * @param {String} value
     */
    set lang(value) {
        lang({ value, ownerElement : this.node })
    }

    /**
     *
     * @returns {String}
     */
    get lang() {
        return this.node.getAttributeNS(XML_NAMESPACE_URI, Lang.qualifiedName)
    }

    /**
     *
     * @param {String} value
     */
    set space(value) {
        space({ value, ownerElement : this.node })
    }

    /**
     *
     * @returns {String}
     */
    get space() {
        return this.node.getAttributeNS(XML_NAMESPACE_URI, Space.qualifiedName)
    }
}

/**
 *
 * @param {*} init
 * @returns {XMLElementAssembler}
 */
export function xmlElement(init) {
    return new XMLElementAssembler(init)
}

