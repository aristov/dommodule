import { DEFAULT_NAMESPACE_PREFIX, DEFAULT_NAMESPACE_URI, NAMESPACE_SEPARATOR } from './const'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const { Attr, Element, document } = window
const INIT_PROPERTY_NAME = 'value'

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-attr}
 */
export class AttrAssembler extends NodeAssembler {
    /**
     * @returns {AttrAssembler}
     */
    remove() {
        const ownerElement = this.ownerElement
        if(ownerElement) {
            return ownerElement.removeAttributeNode(this.node)
        }
        else {
            throw TypeError(`Failed to execute 'remove' on '${
                this.constructor.name 
                }': the ownerElement is null.`)
        }
    }

    /**
     * @returns {String}
     */
    get localName() {
        return this.node.localName
    }

    /**
     * @return {String}
     */
    get name() {
        return this.node.name
    }

    /**
     * @returns {String|null}
     */
    get namespaceURI() {
        return this.node.namespaceURI
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
        else if(ownerElement && ownerElement.constructor === Object) {
            if(this.node.ownerElement) {
                this.ownerElement.init(ownerElement)
            }
            else {
                const { elementAssembler } = this.constructor
                const element = new elementAssembler(ownerElement)
                element.setAttributeNode(node)
            }
        }
        else if(ownerElement === null) this.remove()
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
        const ownerElement = this.node.ownerElement // fixme
        return ownerElement && this.getInstanceOf(ownerElement, this.constructor.elementAssembler)
    }

    /**
     * @return {String}
     */
    get prefix() {
        return this.node.prefix
    }

    /**
     * @param {*} value
     */
    set value(value) {
        if(this.constructor.removeOnValue(value)) {
            this.remove()
        }
        else this.node.value = value
    }

    /**
     * @returns {*}
     */
    get value() {
        return this.node.value
    }

    /**
     * @param {*} [init]
     * @override
     */
    static create(init) {
        const {
            namespace = this.namespace,
            prefix = this.prefix,
            localName = this.localName
        } = init || this
        let name = init && init.name
        if(!name) {
            name = prefix?
                prefix + NAMESPACE_SEPARATOR + localName :
                localName
        }
        return namespace?
            document.createAttributeNS(namespace, name) :
            document.createAttribute(name)
    }

    /**
     * @param {*} value
     * @returns {Boolean}
     */
    static removeOnValue(value) {
        return value === null
    }

    /**
     * @returns {String}
     * @override
     */
    static get initPropertyName() {
        return INIT_PROPERTY_NAME
    }

    /**
     * @returns {window.Attr}
     * @override
     */
    static get interface() {
        return Attr
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
    static get namespace() {
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
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + NAMESPACE_SEPARATOR + localName :
            localName
    }

    /**
     * @returns {String}
     */
    static get selector() {
        return `[${ this.localName }]`
    }
}

NodeAssembler.AttrAssembler = AttrAssembler

/**
 * @param {*} [init]
 * @returns {AttrAssembler}
 */
export function attr(...init) {
    return new AttrAssembler(...init)
}

/**
 * !!! Workaround !!!
 * Garbage collector in Safari drops AttrAssembler instances
 * which have no links from a static memory structure.
 * TODO Write a bug report
 * TODO Implement a custom garbage collector here
 */
const { userAgent } = window.navigator
if(/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    const proto = AttrAssembler.prototype
    const setInstanceOf = proto.setInstanceOf
    AttrAssembler.__instances__ = []
    proto.setInstanceOf = function(target) {
        setInstanceOf.call(this, target)
        AttrAssembler.__instances__.push(this)
    }
}
