import { NodeAssembler } from './node'
import {
    DEFAULT_NAMESPACE_URI,
    DEFAULT_NAMESPACE_PREFIX,
    NAMESPACE_SEPARATOR,
} from './defaults'

const DEFAULT_ATTR_NAME = 'attr'
const FIRST_LETTER_RE = /^(\w)/

/**
 * 
 * @param {String} str
 * @returns {String}
 */
function toLowerCase(str) {
    return str.toLowerCase()
}

export class AttrAssembler extends NodeAssembler {
    /**
     * 
     * @param {*} init
     */
    init(init) {
        if(init.constructor !== Object) {
            this.value = init
            return this.node
        }
        else return super.init(init)
    }

    /**
     * @param {String} value
     */
    set value(value) {
        this.node.value = value
    }

    /**
     * @returns {String}
     */
    get value() {
        return this.node.value
    }

    /**
     * @param {Element} ownerElement
     */
    set ownerElement(ownerElement) {
        if(this.node.namespaceURI) {
            ownerElement.setAttributeNodeNS(this.node)
        }
        else ownerElement.setAttributeNode(this.node)
    }

    /**
     * @returns {Element}
     */
    get ownerElement() {
        return this.node.ownerElement
    }

    /**
     *
     * @param {String} name
     * @param {String} namespaceURI
     * @param {String} qualifiedName
     * @param {String} localName
     * @param {Document} document
     */
    static create({
        name,
        localName = name || this.localName,
        qualifiedName = name || this.qualifiedName,
        namespaceURI = this.namespaceURI,
        document
    } = this) {
        return namespaceURI?
            document.createAttributeNS(namespaceURI, qualifiedName) :
            document.createAttribute(localName)
    }

    /**
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * @returns {String}
     */
    static get prefix() {
        return DEFAULT_NAMESPACE_PREFIX
    }

    /**
     * @returns {String}
     */
    static get localName() {
        return this === AttrAssembler?
            DEFAULT_ATTR_NAME :
            this.name.replace(FIRST_LETTER_RE, toLowerCase)
    }

    /**
     * @returns {String}
     */
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + NAMESPACE_SEPARATOR + localName :
            localName
    }
}

/**
 * 
 * @param {*} init
 * @returns {AttrAssembler}
 */
export function attr(init) {
    return new AttrAssembler(init)
}
