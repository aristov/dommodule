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
        if(typeof init === 'string') this.value = init
        else {
            if(!init || !('value' in init)) {
                this.value = this.constructor.value
            }
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
     * @param {*} ownerElement
     */
    set ownerElement(ownerElement) {
        if(ownerElement instanceof ElementAssembler) {
            ownerElement.attr = this
        }
        else if(this.node.namespaceURI) {
            ownerElement.setAttributeNodeNS(this.node)
        }
        else ownerElement.setAttributeNode(this.node)
    }

    /**
     * @returns {*}
     */
    get ownerElement() {
        return this.getInstance(this.node.ownerElement)
    }

    /**
     * @param {ParentNodeAssembler|*} parentNode
     */
    set parentNode(parentNode) {
        if(!this.ownerElement) {
            this.ownerElement = this.constructor.ownerElement
        }
        this.ownerElement.parentNode = parentNode
    }

    /**
     * @returns {ParentNodeAssembler|*}
     */
    get parentNode() {
        return this.ownerElement && this.ownerElement.parentNode
    }

    /**
     * Set child nodes of the owner element
     * @param {*} childNodes
     */
    set childNodes(childNodes) {
        if(!this.ownerElement) {
            this.ownerElement = this.constructor.ownerElement
        }
        this.ownerElement.childNodes = childNodes
    }

    /**
     * Get child nodes of the owner element
     * @returns {[ChildNodeAssembler]}
     */
    get childNodes() {
        return this.ownerElement && this.ownerElement.childNodes
    }

    /**
     * Set children of the owner element
     * @param {*} children
     */
    set children(children) {
        this.childNodes = children
    }

    /**
     * Get children of the owner element
     * @returns {[ElementAssembler]}
     */
    get children() {
        return this.ownerElement && this.ownerElement.children
    }
    
    /**
     * @returns {ElementAssembler|*}
     */
    static get ownerElement() {
        return new ElementAssembler
    }

    /**
     *
     * @param {*} [init]
     */
    static create(init) {
        const {
            namespaceURI = this.namespaceURI,
            prefix = this.prefix,
            localName = this.localName
        } = init || this
        let name = init && init.name
        if(!name) {
            name = prefix?
                prefix + NAMESPACE_SEPARATOR + localName :
                localName
        }
        return namespaceURI?
            document.createAttributeNS(namespaceURI, name) :
            document.createAttribute(name)
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
