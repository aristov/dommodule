import { ElementAssembler } from './element'
import { NodeAssembler } from './node'

const { prototype : { map } } = Array
const { Attr, Element, Node, document } = window
const EMPTY_STRING = ''
const VALUE_PROPERTY_NAME = 'value'
const qualifiedName = Object.getOwnPropertyDescriptor(ElementAssembler, 'qualifiedName').get

/**
 * @see https://www.w3.org/TR/dom/#interface-attr
 */
export class AttrAssembler extends NodeAssembler {
    /**
     * Remove the attribute from it's owner element
     */
    remove() {
        const ownerElement = this.node.ownerElement
        if(ownerElement) {
            ownerElement.removeAttribute(this.name)
        }
    }

    /**
     * @return {string}
     */
    get name() {
        return this.node.name
    }

    /**
     * @param {ElementAssembler|Element|*} ownerElement
     */
    set ownerElement(ownerElement) {
        const node = this.node
        if(ownerElement instanceof ElementAssembler) {
            ownerElement.setAttr(node)
        }
        else if(ownerElement instanceof Element) {
            ownerElement.attributes.setNamedItem(node)
        }
        else if(ownerElement) {
            if(node.ownerElement) {
                this.ownerElement.init(ownerElement)
            }
            else {
                const element = new this.constructor.elementAssembler(ownerElement)
                element.setAttr(node)
            }
        }
    }

    /**
     * @returns {ElementAssembler|null}
     */
    get ownerElement() {
        return this.getInstanceOf(this.node.ownerElement)
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
        return document.createAttributeNS(this.namespace, this.qualifiedName)
    }

    /**
     * @param {ElementAssembler|Element|*} element
     * @returns {AttrAssembler|*}
     */
    static getAttrOf(element) {
        const node = this.getNodeOf(element)
        const attr = node.attributes.getNamedItem(this.qualifiedName)
        return attr && this.getInstanceOf(attr)
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
        return VALUE_PROPERTY_NAME
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
        return qualifiedName.call(this)
    }

    /**
     * @returns {string}
     */
    static get selector() {
        return `[${ this.localName }]`
    }
}

NodeAssembler.AttrAssembler = AttrAssembler
