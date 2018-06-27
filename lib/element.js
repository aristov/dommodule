import {
    EMPTY_STRING,
    NAMESPACE_SEPARATOR,
    NO_PARENT_INDEX
} from './common'
import { AttrAssembler } from './attr'
import { NodeAssembler } from './node'
import { ParentNodeAssembler } from './parentnode'

const { keys } = Object
const { isArray, prototype : { indexOf, map, forEach } } = Array
const { Attr, Document, Element, Node, document } = window

const CHILDREN_PROPERTY_NAME = 'children'
const SELECT_ALL_SELECTOR = '*'
const SPACE = ' '
const registry = {}

let counter = Date.now()

/**
 * @see https://www.w3.org/TR/dom/#interface-element
 */
export class ElementAssembler extends ParentNodeAssembler {
    /**
     * @param {class|string} object - ElementAssembler or AttrAssembler subclass or selector
     * @returns {ElementAssembler|AttrAssembler|*|null}
     */
    closest(object) {
        if(object.prototype) {
            const node = this.node.closest(object.selector)
            if(node) {
                const isAttr = AttrAssembler.isPrototypeOf(object)
                const element = this.getInstanceOf(node, !isAttr && object)
                return isAttr?
                    element.getAttr(object) :
                    element
            }
            return null
        }
        return this.getInstanceOf(this.node.closest(object))
    }

    /**
     * this.getAttr(Foo)
     * this.getAttr('foo')
     *
     * @param {class|string} attr
     * @returns {AttrAssembler|*|null}
     */
    getAttr(attr) {
        const { attributes } = this.node
        return attr.prototype?
            this.getInstanceOf(attributes.getNamedItem(attr.qualifiedName), attr) :
            this.getInstanceOf(attributes.getNamedItem(attr))
    }

    /**
     * this.hasAttr(Foo)
     * this.hasAttr('foo')
     *
     * @param {class|string} attr
     * @returns {boolean}
     */
    hasAttr(attr) {
        const node = this.node
        return attr.prototype?
            node.hasAttribute(attr.qualifiedName) :
            node.hasAttribute(attr)
    }

    /**
     * this.removeAttr(this.getAttr('attr'))
     * this.removeAttr(this.node.getAttribute('attr'))
     * this.removeAttr(AttrAssembler)
     * this.removeAttr('attr')
     *
     * @param {AttrAssembler|Attr|class|string} attr
     */
    removeAttr(attr) {
        const node = this.node
        if(attr instanceof AttrAssembler) {
            attr.remove()
        }
        else if(attr.prototype) {
            const instance = this.getAttr(attr)
            instance && instance.remove()
        }
        else node.removeAttribute(attr instanceof Attr? attr.name : attr)
    }

    /**
     * this.setAttr(new Foo({ value : 'bar' }))
     * this.setAttr(document.createAttribute('foo'))
     * this.setAttr(Foo, 'bar')
     * this.setAttr('foo', 'bar')
     *
     * @param {AttrAssembler|Attr|class|string} attr
     * @param {function} [attr.removeOnValue]
     * @param {string|*} value
     */
    setAttr(attr, value) {
        const node = this.node
        if(attr instanceof AttrAssembler) {
            attr.ownerElement = node
        }
        else if(attr instanceof Attr) {
            node.attributes.setNamedItem(attr)
        }
        else if(attr.prototype) {
            const instance = this.getAttr(attr)
            if(instance) {
                instance.value = value
            }
            else if(!attr.removeOnValue(value)) {
                new attr({ ownerElement : node, value })
            }
        }
        else if(!this.constructor.attrAssembler.removeOnValue(value)) {
            node.setAttribute(attr, value)
        }
    }

    /**
     * Set content attributes on the element
     * @param {*} attributes
     */
    set attributes(attributes) {
        if(isArray(attributes)) {
            attributes.forEach(attr => this.setAttr(attr))
        }
        else if(attributes.constructor === Object) {
            for(let name in attributes) {
                const value = attributes[name]
                if(attributes.hasOwnProperty(name) && value !== null) {
                    this.setAttr(name, value)
                }
            }
        }
        else this.setAttr(attributes)
    }

    /**
     * Get all attributes of the element as an array
     * @returns {AttrAssembler[]}
     */
    get attributes() {
        return map.call(this.node.attributes, node => this.getInstanceOf(node))
    }

    /**
     * Set the class list of the element
     * @param {*} classList token / token list / token-boolean dict {string|string[]|{}}
     */
    set classList(classList) {
        if(classList) {
            const _classList = this.node.classList
            if(isArray(classList)) {
                classList.forEach(token => this.classList = token)
            }
            else if(classList.constructor === Object) {
                keys(classList).forEach(token => {
                    if(classList[token]) {
                        _classList.add(token)
                    }
                })
            }
            else _classList.add(...classList.split(' '))
        }
    }

    /**
     * Get the class list of the element as an array
     * @returns {DOMTokenList} classList interface
     */
    get classList() {
        return this.node.classList
    }

    /**
     * Set the class name of the element
     * @param {string} className
     */
    set className(className) {
        this.node.className = className
    }

    /**
     * Get the class name of the element
     * @returns {string}
     */
    get className() {
        return this.node.className
    }

    /**
     * Get the element index among its sibling elements or -1 if it has no parent
     * @returns {number}
     */
    get elementIndex() {
        const parentNode = this.node.parentNode
        return parentNode?
            indexOf.call(parentNode.children, this.node) :
            NO_PARENT_INDEX
    }

    /**
     * Set the unique identifier on the element
     * @param {string} id
     */
    set id(id) {
        this.node.id = id
    }

    /**
     * Get the unique identifier of the element
     * @returns {string}
     */
    get id() {
        return this.node.id
    }

    /**
     * @returns {string}
     */
    get localName() {
        return this.node.localName
    }

    /**
     * @returns {string|null}
     */
    get namespaceURI() {
        return this.node.namespaceURI
    }

    /**
     * @return {string}
     */
    get prefix() {
        return this.node.prefix
    }

    /**
     * @return {string}
     */
    get tagName() {
        return this.node.tagName
    }

    /**
     * Create the specified Element node
     * @returns {Element|*} created element
     * @override
     */
    static create() {
        return document.createElementNS(this.namespace, this.qualifiedName)
    }

    /**
     * Generate a unique identifier among the document's tree
     * @returns {String}
     */
    static generateId() {
        let id
        do id = this.name + counter++
        while(document.getElementById(id))
        return id
    }

    /**
     * @param {string|Element|Document|DocumentFragment} [selectorOrContext=this.selector]
     * @param {Element|Document|DocumentFragment} [context=window.document]
     * @returns {ElementAssembler[]} array of initialized instances
     */
    static init(selectorOrContext = this.selector, context = document) {
        if(selectorOrContext instanceof Node) {
            context = selectorOrContext
            selectorOrContext = this.selector
        }
        return map.call(context.querySelectorAll(selectorOrContext), node => {
            return new this({ node })
        })
    }

    /**
     * Register assembler by it's namespace and localName
     */
    static register() {
        const { namespace, localName } = this
        const name = namespace?
            localName? namespace + SPACE + localName : namespace :
            localName
        this.registry[name] = this
    }

    /**
     * @param {Element|*} node
     * @returns {ElementAssembler|*}
     */
    static resolve(node) {
        const namespace = this.namespace || null
        const { namespaceURI, localName } = node
        if(namespace === namespaceURI && this.localName === localName) {
            return this
        }
        else {
            const registry = this.registry
            const assembler = namespaceURI?
                registry[namespaceURI + SPACE + localName] || registry[namespaceURI] :
                registry[localName]
            return assembler || ElementAssembler
        }
    }

    /**
     * @returns {string}
     * @override
     */
    static get defaultPropertyName() {
        return CHILDREN_PROPERTY_NAME
    }

    /**
     * @returns {{}}
     */
    static get registry() {
        return registry
    }

    /**
     * @returns {interface} Element
     * @override
     */
    static get interface() {
        return Element
    }

    /**
     * The local name of the element node
     * @returns {string}
     */
    static get localName() {
        return this === this.superAssembler?
            EMPTY_STRING :
            this.name.toLowerCase()
    }

    /**
     * Default namespace URI
     * @returns {string}
     */
    static get namespace() {
        return EMPTY_STRING
    }

    /**
     * The XML namespace prefix
     * @returns {string}
     */
    static get prefix() {
        return EMPTY_STRING
    }

    /**
     * The qualified name of the element node
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
        return this.localName || SELECT_ALL_SELECTOR
    }

    /**
     * @returns {class} ElementAssembler
     */
    static get superAssembler() {
        return ElementAssembler
    }
}

NodeAssembler.ElementAssembler = ElementAssembler

/**
 * Element assembler factory
 * @param {*} [init]
 * @returns {ElementAssembler|*}
 */
export function element(init) {
    return new ElementAssembler(init)
}
