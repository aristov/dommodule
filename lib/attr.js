import {
    TYPE_STRING,
    DEFAULT_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR
} from './const'
import { Attr, Element, document } from './dom'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const DEFAULT_ATTR_VALUE = ''
const VALUE_PROPERTY_NAME = 'value'
const NODE_PROPERTY_NAME = 'node'

export class AttrAssembler extends NodeAssembler {
    /**
     * @param {*} init
     */
    init(init) {
        if(typeof init === TYPE_STRING) this.value = init
        else {
            super.init(init)
            if(init && init.constructor === Object) {
                if(init.hasOwnProperty(VALUE_PROPERTY_NAME)) {
                    this.value = init.value
                }
                else if(!init.hasOwnProperty(NODE_PROPERTY_NAME)) {
                    this.value = this.constructor.value
                }
            }
            else this.value = this.constructor.value
        }
    }

    // todo: remove() {}

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
        else if(ownerElement === null && this.ownerElement) {
            this.ownerElement.removeAttributeNode(this)
        }
        else {
            throw TypeError(`Failed to set 'ownerElement' on '${
                this.constructor.name
                }': parameter is not of expected type.`)
        }
    }

    /**
     * @returns {*}
     */
    get ownerElement() {
        const ownerElement = this.node.ownerElement
        if(ownerElement) {
            const element = this.getInstance(ownerElement)
            if(element) return element
            else {
                const { elementAssembler } = this.constructor
                return new elementAssembler({ node : ownerElement })
            }
        }
        else return null
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
        return DEFAULT_PREFIX
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

    /**
     * @returns {Function}
     */
    static get interface() {
        return Attr
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
