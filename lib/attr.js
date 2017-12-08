import {
    DEFAULT_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    TYPE_STRING
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
        if(typeof init === TYPE_STRING || init === null) {
            this.value = init
            return false
        }
        else return super.init(init)
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
     * @returns {String|null}
     */
    get namespaceURI() {
        return this.node.namespaceURI
    }

    /**
     * @return {String}
     */
    get prefix() {
        return this.node.prefix
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
     * @param {*} value
     */
    set value(value) {
        if(value === null) this.remove()
        else this.node.value = value
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
        else if(ownerElement && ownerElement.constructor === Object) {
            const assembler = this.constructor.elementAssembler
            const element = new assembler(ownerElement)
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
    static get selector() {
        return `[${ this.localName }]`
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
