import {
    DEFAULT_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR
} from './const'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const { Attr, Element, document } = window

export class AttrAssembler extends NodeAssembler {
    /**
     * @param {*} init
     * @returns {Boolean}
     */
    init(init) {
        if(super.init(init)) return true
        else if(typeof init !== 'undefined') {
            this.value = init
            return true
        }
        return false
    }

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
            const { elementAssembler } = this.constructor
            const element = new elementAssembler(ownerElement)
            element.setAttributeNode(node)
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
        const ownerElement = this.node.ownerElement
        if(ownerElement) {
            const { elementAssembler } = this.constructor
            return this.getInstance(ownerElement, elementAssembler)
        }
        else return null
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
     *
     * @param {*} [init]
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

    /**
     * @returns {String}
     */
    static get localName() {
        return this === AttrAssembler?
            LOCAL_NAME :
            this.name.toLowerCase()
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
        return DEFAULT_PREFIX
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
    static get selector() {
        return `[${ this.localName }]`
    }
}

/**
 *
 * @param {...*} [init]
 * @returns {AttrAssembler}
 */
export function attr(...init) {
    return new AttrAssembler(...init)
}

const LOCAL_NAME = attr.name
