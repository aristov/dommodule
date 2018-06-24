import { EMPTY_STRING, NAMESPACE_SEPARATOR } from './common'
import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const { prototype : { map } } = Array
const { Attr, Element, Node, document } = window
const DEFAULT_PROPERTY_NAME = 'value'

/**
 * @see https://www.w3.org/TR/dom/#interface-attr
 */
export class AttrAssembler extends NodeAssembler {
    /**
     * Remove the attribute from it's owner element
     */
    remove() {
        const ownerElement = this.ownerElement
        if(ownerElement) {
            ownerElement.removeAttributeNode(this.node)
        }
    }

    /**
     * @returns {string}
     */
    get localName() {
        return this.node.localName
    }

    /**
     * @return {string}
     */
    get name() {
        return this.node.name
    }

    /**
     * @returns {string|null}
     */
    get namespaceURI() {
        return this.node.namespaceURI
    }

    /**
     * @param {ElementAssembler|Element|{}|null} ownerElement
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
            if(node.ownerElement) {
                this.ownerElement.init(ownerElement)
            }
            else {
                const element = new this.constructor.elementAssembler(ownerElement)
                element.setAttributeNode(node)
            }
        }
        else throw TypeError(`Failed to set 'ownerElement' on '${ this.constructor.name }': parameter is not of expected type.`)
    }

    /**
     * @returns {ElementAssembler|null}
     */
    get ownerElement() {
        return this.getInstanceOf(this.node.ownerElement)
    }

    /**
     * @param {ElementAssembler|Element|*|null} parentElement
     */
    set parentElement(parentElement) {
        if(this.node.ownerElement) {
            this.ownerElement.parentElement = parentElement
        }
        else throw Error(`Failed to set 'parentElement' on '${ this.constructor.name }': the 'ownerElement' is null.`)
    }

    /**
     * @returns {ElementAssembler|*|null}
     */
    get parentElement() {
        return this.node.ownerElement && this.ownerElement.parentElement
    }

    /**
     * @param {ParentNodeAssembler|*|null} parentNode
     */
    set parentNode(parentNode) {
        if(this.node.ownerElement) {
            this.ownerElement.parentNode = parentNode
        }
        else throw Error(`Failed to set 'parentNode' on '${ this.constructor.name }': the 'ownerElement' is null.`)
    }

    /**
     * @returns {ParentNodeAssembler|*|null}
     */
    get parentNode() {
        return this.node.ownerElement && this.ownerElement.parentNode
    }

    /**
     * @return {string}
     */
    get prefix() {
        return this.node.prefix
    }

    /**
     * @param {string|*} value
     */
    set value(value) {
        if(this.constructor.removeOnValue(value)) {
            this.remove()
        }
        else this.node.value = value
    }

    /**
     * @returns {string|*}
     */
    get value() {
        return this.node.value
    }

    /**
     * @returns {Attr|*}
     * @override
     */
    static create() {
        return document.createAttribute(this.localName)
    }

    /**
     * @param {ElementAssembler|*} element
     * @returns {string|null}
     */
    static getValueOf(element) {
        const attr = element.getAttributeNode(this)
        return attr? attr.value : this.defaultValue
    }

    /**
     * @param {string|Element|Document|DocumentFragment} [selectorOrContext=this.selector]
     * @param {Element|Document|DocumentFragment} [context=window.document]
     * @returns {AttrAssembler[]} array of initialized instances
     */
    static init(selectorOrContext, context = document) {
        const localName = this.localName
        if(selectorOrContext instanceof Node) {
            context = selectorOrContext
            selectorOrContext = this.selector
        }
        return map.call(context.querySelectorAll(selectorOrContext), ownerElement => {
            const node = ownerElement.attributes[localName]
            return node?
                new this({ node }) :
                new this({ ownerElement })
        })
    }

    /**
     * @param {*} value
     * @returns {boolean}
     */
    static removeOnValue(value) {
        return value === null
    }

    /**
     * @returns {string}
     * @override
     */
    static get defaultPropertyName() {
        return DEFAULT_PROPERTY_NAME
    }

    /**
     * @returns {null|*}
     */
    static get defaultValue() {
        return null
    }

    /**
     * @returns {interface} Attr
     * @override
     */
    static get interface() {
        return Attr
    }

    /**
     * @returns {string}
     */
    static get localName() {
        return this === AttrAssembler?
            EMPTY_STRING :
            this.name.toLowerCase()
    }

    /**
     * @returns {string}
     */
    static get namespace() {
        return EMPTY_STRING
    }

    /**
     * @returns {string}
     */
    static get prefix() {
        return EMPTY_STRING
    }

    /**
     * @returns {string}
     */
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + NAMESPACE_SEPARATOR + localName :
            localName
    }

    /**
     * @returns {string}
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
export function attr(init) {
    return new AttrAssembler(init)
}
