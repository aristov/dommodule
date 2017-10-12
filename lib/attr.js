import {
    document,
    DEFAULT_NAMESPACE_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR
} from './core'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const DEFAULT_ATTR_VALUE = ''

export class AttrAssembler extends NodeAssembler {
    /**
     * @param {*} init
     */
    init(init) {
        if(init.constructor !== Object) {
            this.value = init
        }
        else if('value' in init) {
            this.value = init.value
        }
        else {
            this.value = this.constructor.value
            super.init(init)
        }
    }

    /**
     * @param {*} value
     */
    set value(value) {
        this.node.value = value
    }

    /**
     * @returns {*}
     */
    get value() {
        return this.node.value
    }

    /**
     * @param {ElementAssembler|*} ownerElement
     */
    set ownerElement(ownerElement) {
        if(ownerElement instanceof ElementAssembler) {
            ownerElement.attr = this
        }
        else ownerElement.setAttributeNodeNS(this.node)
    }
    
    /**
     * @returns {ElementAssembler|*}
     */
    get ownerElement() {
        return this.getInstance(this.node.ownerElement)
    }

    /**
     *
     * @param {String} name
     * @param {String} namespaceURI
     * @param {String} qualifiedName
     * @param {String} localName
     */
    static create({
        name,
        localName = name || this.localName,
        qualifiedName = name || this.qualifiedName,
        namespaceURI = this.namespaceURI
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
        return this === AttrAssembler? attr.name : this.name.toLowerCase()
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

    /**
     * @returns {String}
     */
    static get value() {
        return DEFAULT_ATTR_VALUE
    }
}

/**
 * 
 * @param {*} init
 * @returns {AttrAssembler}
 */
export function attr(...init) {
    return new AttrAssembler(...init)
}
