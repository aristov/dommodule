import {
    Attr,
    DEFAULT_NAMESPACE_PREFIX,
    DEFAULT_NAMESPACE_URI,
    Element,
    NAMESPACE_SEPARATOR,
    TYPE_STRING,
    document,
} from './core'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const DEFAULT_ATTR_VALUE = ''
const VALUE_PROPERTY_NAME = 'value'

export class AttrAssembler extends NodeAssembler {
    /**
     * @param {*} init
     */
    init(init) {
        if(typeof init === TYPE_STRING) this.value = init
        else {
            if(init && init.node instanceof Attr) {
                this.node = init.node
            }
            else if(!init || !init.hasOwnProperty(VALUE_PROPERTY_NAME)) {
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
        const node = this.node
        if(ownerElement instanceof ElementAssembler) {
            ownerElement.setAttributeNode(node)
        }
        else if(ownerElement instanceof Element) {
            if(node.namespaceURI) {
                ownerElement.setAttributeNodeNS(node)
            }
            else ownerElement.setAttributeNode(node)
        }
        else if(ownerElement === null) {
            if(this.ownerElement) {
                this.ownerElement.removeAttributeNode(this)
            }
        }
        else {
            throw TypeError(`Failed to execute 'set ownerElement' on '${
                this.constructor.name
                }': parameter is not of expected type.`)
        }
    }

    /**
     * @returns {*}
     */
    get ownerElement() {
        const ownerElement = this.node.ownerElement
        if(!ownerElement) return null
        else {
            const assembler = this.constructor.elementAssembler
            return this.getInstance(ownerElement) || new assembler({ node : ownerElement })
        }
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
        return this.ownerElement? this.ownerElement.childNodes : []
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
        return this.ownerElement? this.ownerElement.children : []
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
     * The qualified name of the element node
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

    /**
     * @returns {Function}
     */
    static get elementAssembler() {
        return ElementAssembler
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
