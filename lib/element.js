import {
    TYPE_STRING,
    TYPE_FUNCTION,
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
const DEFAULT_PROPERTY_NAME = 'children'
const DEFAULT_SELECTOR = '*'
const IGNORED_PROPERTY_NAMES = ['namespace', 'localName', 'qualifiedName', 'prefix']
const resolver = {}

/**
 * @see https://www.w3.org/TR/dom/#interface-element
 */
export class ElementAssembler extends ParentNodeAssembler {
    /**
     * @param {class|string} object - ElementAssembler or AttrAssembler subclass or selector
     * @returns {?ElementAssembler|AttrAssembler|*}
     */
    closest(object) {
        if(typeof object === TYPE_FUNCTION) {
            const node = this.node.closest(object.selector)
            if(node) {
                const isAttr = AttrAssembler.isPrototypeOf(object)
                const element = this.getInstanceOf(node, !isAttr && object)
                return isAttr?
                    element.getAttributeNode(object) :
                    element
            }
            return null
        }
        return this.getInstanceOf(this.node.closest(object))
    }

    /**
     * this.getAttribute(AttrAssembler)
     * this.getAttribute('attr')
     *
     * @param {class|string} attr
     * @returns {?string|*}
     */
    getAttribute(attr) {
        if(typeof attr === TYPE_FUNCTION) {
            const instance = this.getAttributeNode(attr)
            return instance? instance.value : attr.defaultValue
        }
        return this.node.getAttribute(attr)
    }

    /**
     * this.getAttributeNode(AttrAssembler)
     * this.getAttributeNode('attr')
     *
     * @param {class|string} attr
     * @returns {?AttrAssembler|*}
     */
    getAttributeNode(attr) {
        const node = this.node
        const isFunction = typeof attr === TYPE_FUNCTION
        let attrNode
        if(isFunction) {
            const { namespace, qualifiedName, localName } = attr
            attrNode = namespace?
                node.getAttributeNodeNS(namespace, localName) :
                node.getAttributeNode(qualifiedName)
        }
        else {
            attrNode = node.getAttributeNode(attr)
        }
        return this.getInstanceOf(attrNode, isFunction && attr)
    }

    /**
     * @param {class|string} attr
     * @returns {boolean}
     */
    hasAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespace, qualifiedName, localName } = attr
            return namespace?
                node.hasAttributeNS(namespace, localName) :
                node.hasAttribute(qualifiedName)
        }
        return node.hasAttribute(attr)
    }

    /**
     * @returns {boolean}
     */
    hasAttributes() {
        return this.node.hasAttributes()
    }

    /**
     * @param {string} selectors
     * @returns {boolean}
     */
    matches(selectors) {
        return this.node.matches(selectors)
    }

    /**
     * @param {class|string} attr
     */
    removeAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespace, qualifiedName, localName } = attr
            if(namespace) {
                node.removeAttributeNS(namespace, localName)
            }
            else node.removeAttribute(qualifiedName)
        }
        else node.removeAttribute(attr)
    }

    /**
     * this.removeAttributeNode('attr')
     * this.removeAttributeNode(AttrAssembler)
     * this.removeAttributeNode(this.getAttributeNode('attr'))
     * this.removeAttributeNode(this.node.getAttributeNode('attr'))
     *
     * @param {AttrAssembler|Attr|class|string} attr
     * @returns {?AttrAssembler}
     */
    removeAttributeNode(attr) {
        const type = typeof attr
        const isFunction = type === TYPE_FUNCTION
        if(isFunction || type === TYPE_STRING) {
            const instance = this.getAttributeNode(attr)
            if(instance) {
                instance.remove()
                return instance
            }
            return null
        }
        return attr instanceof AttrAssembler?
            attr.remove() :
            this.getInstanceOf(this.node.removeAttributeNode(attr), isFunction && attr)
    }

    /**
     * this.setAttribute(AttrAssembler, 'foobar')
     * this.setAttribute('attr', 'foobar')
     *
     * @param {class|string} attr
     * @param {function} [attr.removeOnValue]
     * @param {string|*} value
     */
    setAttribute(attr, value) {
        const instance = this.getAttributeNode(attr)
        if(instance) {
            instance.value = value
        }
        else {
            if(typeof attr === TYPE_FUNCTION) {
                if(!attr.removeOnValue(value)) {
                    const instance = new attr
                    this.setAttributeNode(instance)
                    instance.value = value
                }
            }
            else if(!this.constructor.attrAssembler.removeOnValue(value)) {
                this.node.setAttribute(attr, value)
            }
        }
    }

    /**
     * this.setAttributeNode(new AttrAssembler)
     * this.setAttributeNode(document.createAttribute('attr'))
     *
     * @param {AttrAssembler|Attr} attr
     * @returns {?AttrAssembler}
     */
    setAttributeNode(attr) {
        const node = this.node
        let replacedNode
        if(attr instanceof AttrAssembler) {
            const { namespaceURI, name } = attr
            replacedNode = namespaceURI?
                node.getAttributeNodeNS(namespaceURI, name) :
                node.getAttributeNode(name)
            attr.ownerElement = node
        }
        else {
            replacedNode = attr.namespaceURI?
                node.setAttributeNodeNS(attr) :
                node.setAttributeNode(attr)
        }
        return this.getInstanceOf(replacedNode)
    }

    /**
     * @param {string} name
     * @param {string} value
     */
    setProperty(name, value) {
        if(!IGNORED_PROPERTY_NAMES.includes(name)) {
            super.setProperty(name, value)
        }
    }

    /**
     * Set content attributes on the element
     * @param {*} attributes
     */
    set attributes(attributes) {
        if(attributes instanceof AttrAssembler) {
            attributes.ownerElement = this.node
        }
        else if(isArray(attributes)) {
            attributes.forEach(attr => this.attributes = attr)
        }
        else this.setAttributeNode(attributes)
    }

    /**
     * Get all attributes of the element as an array
     * @returns {AttrAssembler[]}
     */
    get attributes() {
        return map.call(this.node.attributes, node => this.getInstanceOf(node))
    }

    /**
     * Set content attributes on the element
     * @param {*} attrset dictionary object
     */
    set attrset(attrset) {
        const node = this.node
        for(let name in attrset) {
            if(attrset.hasOwnProperty(name)) {
                node.setAttribute(name, attrset[name])
            }
        }
    }

    /**
     * Get all content attributes of the element as a dictionary-object
     * @returns {{}}
     */
    get attrset() {
        const attrset = {}
        forEach.call(this.node.attributes, ({ name, value }) => {
            attrset[name] = value
        })
        return attrset
    }

    /**
     * Append children to the element
     * @param {*} children
     */
    set children(children) {
        this.childNodes = children
    }

    /**
     * Get all children of the element as an array
     * @returns {ElementAssembler[]}
     */
    get children() {
        return map.call(this.node.children, node => this.getInstanceOf(node))
    }

    /**
     * Set the class list of the element
     * @param {*} classList token / token list / token-boolean dict {string|string[]|{}}
     */
    set classList(classList) {
        if(classList) {
            const list = this.node.classList
            if(isArray(classList)) {
                classList.forEach(token => this.classList = token)
            }
            else if(classList.constructor === Object) {
                keys(classList).forEach(token => {
                    if(classList[token]) {
                        list.add(token)
                    }
                })
            }
            else list.add(classList)
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
        if(className) {
            this.node.className = className
        }
        else this.node.removeAttribute('class')
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
     * @returns {ChildNodeAssembler|*}
     */
    get firstElementChild() {
        return this.getInstanceOf(this.node.firstElementChild)
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
     * @returns {ChildNodeAssembler|*}
     */
    get lastElementChild() {
        return this.getInstanceOf(this.node.lastElementChild)
    }

    /**
     * @returns {string}
     */
    get localName() {
        return this.node.localName
    }

    /**
     * @returns {?string}
     */
    get namespaceURI() {
        return this.node.namespaceURI
    }

    /**
     * Get a next sibling of the element
     * @returns {?ChildNodeAssembler|*}
     */
    get nextElementSibling() {
        return this.getInstanceOf(this.node.nextElementSibling)
    }
    
    /**
     * @return {string}
     */
    get prefix() {
        return this.node.prefix
    }

    /**
     * Get a previous sibling of the element
     * @returns {?ChildNodeAssembler|*}
     */
    get previousElementSibling() {
        return this.getInstanceOf(this.node.previousElementSibling)
    }

    /**
     * @return {string}
     */
    get tagName() {
        return this.node.tagName
    }

    /**
     * Create the specified Element node
     * @param {*} [init]
     * @returns {Element|*} created element
     * @override
     */
    static create(init) {
        const {
            namespace = this.namespace,
            prefix = this.prefix,
            localName = this.localName
        } = init || this
        let qualifiedName = init && init.qualifiedName
        if(!qualifiedName) {
            qualifiedName = prefix?
                prefix + NAMESPACE_SEPARATOR + localName :
                localName
        }
        return document.createElementNS(namespace, qualifiedName)
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
        this.elementResolver[this.namespace + this.localName] = this
    }

    /**
     * @param {Element|*} node
     * @returns {ElementAssembler|*}
     */
    static resolveElement(node) {
        const resolver = this.elementResolver
        const { namespaceURI, localName } = node
        const assembler = namespaceURI?
            resolver[namespaceURI + localName] || resolver[namespaceURI] :
            resolver[localName]
        return assembler || ElementAssembler
    }

    /**
     * @returns {string}
     * @override
     */
    static get defaultPropertyName() {
        return DEFAULT_PROPERTY_NAME
    }

    /**
     * @returns {{}}
     */
    static get elementResolver() {
        return resolver
    }

    /**
     * @returns {class} Element
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
        return this.localName || DEFAULT_SELECTOR
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
