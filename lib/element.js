import {
    TYPE_STRING,
    TYPE_FUNCTION,
    DEFAULT_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    NO_PARENT_INDEX
} from './const'
import { AttrAssembler } from './attr'
import { DocumentAssembler } from './document'
import { ParentNodeAssembler } from './parentnode'

const { keys } = Object
const { isArray, prototype : { indexOf, map, reduce } } = Array
const { Document, Element, document } = window

const INIT_PROPERTY_NAME = 'children'

/**
 * @param {Object} attrset
 * @param {String} name
 * @param {String} value
 * @returns {Object}
 */
function attrset(attrset, { name, value }) {
    attrset[name] = value
    return attrset
}

/**
 * Element DOM node assembler
 */
export class ElementAssembler extends ParentNodeAssembler {

    /**
     * @param {Function|String} object
     * @returns {ElementAssembler|AttrAssembler|*|null}
     */
    closest(object) {
        if(typeof object === 'function') {
            const node = this.node.closest(object.selector)
            if(node) {
                const element = this.getInstance(node)
                return object.prototype instanceof AttrAssembler?
                    element.getAttributeNode(object) :
                    element
            }
            else return null
        }
        else return this.getInstance(this.node.closest(object))
    }

    /**
     * this.getAttribute(AttrAssembler)
     * this.getAttribute('attr')
     *
     * @param {Function|String} attr
     * @returns {*}
     */
    getAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespace, qualifiedName, localName } = attr
            return namespace?
                node.getAttributeNS(namespace, localName) :
                node.getAttribute(qualifiedName)
        }
        else return node.getAttribute(attr)
    }

    /**
     * @returns {String[]}
     */
    getAttributeNames() {
        return this.node.getAttributeNames()
    }

    /**
     * this.getAttributeNode(AttrAssembler)
     * this.getAttributeNode('attr')
     *
     * @param {Function|String} attr
     * @returns {AttrAssembler|null}
     */
    getAttributeNode(attr) {
        const node = this.node
        const isFunctionType = typeof attr === TYPE_FUNCTION
        let attrNode
        if(isFunctionType) {
            const { namespace, qualifiedName, localName } = attr
            attrNode = namespace?
                node.getAttributeNodeNS(namespace, localName) :
                node.getAttributeNode(qualifiedName)
        }
        else attrNode = node.getAttributeNode(attr)
        if(attrNode) {
            const assembler = isFunctionType?
                attr :
                this.constructor.attrAssembler
            return this.getInstance(attrNode, assembler)
        }
        else return null
    }

    /**
     * @param {String} classNames
     * @returns {(ElementAssembler)[]}
     */
    getElementsByClassName(classNames) {
        const nodes = this.node.getElementsByClassName(classNames)
        const { elementAssembler } = this.constructor
        return map.call(nodes, node => {
            return this.getInstance(node, elementAssembler)
        })
    }

    /**
     * @param {Function|String} object
     * @returns {*}
     */
    getElementsByTagName(object) {
        let nodes, assembler
        const node = this.node
        const isFunction = typeof object === 'function'
        const isAssembler = object === ElementAssembler
            || ElementAssembler.isPrototypeOf(object)
        if(isFunction && isAssembler) {
            const { namespace, localName, qualifiedName } = object
            nodes = namespace?
                node.getElementsByTagNameNS(namespace, localName) :
                node.getElementsByTagName(qualifiedName)
            assembler = object
        }
        else {
            nodes = node.getElementsByTagName(object)
            assembler = this.constructor.elementAssembler
        }
        return map.call(nodes, node => {
            return this.getInstance(node, assembler)
        })
    }

    /**
     * @param {Function|String} attr
     * @returns {Boolean}
     */
    hasAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespace, qualifiedName, localName } = attr
            return namespace?
                node.hasAttributeNS(namespace, localName) :
                node.hasAttribute(qualifiedName)
        }
        else return node.hasAttribute(attr)
    }

    /**
     * @returns {Boolean}
     */
    hasAttributes() {
        return this.node.hasAttributes()
    }

    /**
     * @param {String} selectors
     * @returns {Boolean}
     */
    matches(selectors) {
        return this.node.matches(selectors)
    }

    /**
     * @param {Function|String} attr
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
     * @param {AttrAssembler|Attr|Function|String} attr
     * @returns {AttrAssembler|ElementAssembler.attrAssembler|null}
     */
    removeAttributeNode(attr) {
        const node = this.node
        const type = typeof attr
        if(type === TYPE_STRING || type === TYPE_FUNCTION) {
            const instance = this.getAttributeNode(attr)
            if(instance) {
                node.removeAttributeNode(instance.node)
                return instance
            }
            else return null
        }
        else {
            if(attr instanceof AttrAssembler) return attr.remove()
            else {
                const attrNode = node.removeAttributeNode(attr)
                const { attrAssembler } = this.constructor
                return this.getInstance(attrNode, attrAssembler)
            }
        }
    }

    /**
     * this.setAttribute(AttrAssembler, 'foobar')
     * this.setAttribute('attr', 'foobar')
     *
     * @param {Function|String|*} attr
     * @param {*} value
     */
    setAttribute(attr, value) {
        const instance = this.getAttributeNode(attr)
        if(instance) instance.value = value
        else {
            if(typeof attr === TYPE_FUNCTION) {
                if(!attr.removeOnValue(value)) {
                    this.setAttributeNode(new attr({ value }))
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
     * @returns {AttrAssembler|ElementAssembler.attrAssembler|null}
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
        if(replacedNode) {
            const { attrAssembler } = this.constructor
            return this.getInstance(replacedNode, attrAssembler)
        }
        else return null
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
     * @returns {Array}
     */
    get attributes() {
        const { attrAssembler } = this.constructor
        return map.call(this.node.attributes, node => {
            return this.getInstance(node, attrAssembler)
        })
    }

    /**
     * Set content attributes on the element
     * @param {*} attrset dictionary object
     */
    set attrset(attrset) {
        const node = this.node
        for(let name in attrset) {
            node.setAttribute(name, attrset[name])
        }
    }

    /**
     * Get all content attributes of the element as a dictionary-object
     * @returns {{}}
     */
    get attrset() {
        return reduce.call(this.node.attributes, attrset, {})
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
     * @returns {Array}
     */
    get children() {
        const { elementAssembler } = this.constructor
        return map.call(this.node.children, node => {
            return this.getInstance(node, elementAssembler)
        })
    }

    /**
     * Set the class list of the element
     * @param {*} classList token / token list / token-boolean dict {String|Array|{}}
     */
    set classList(classList) {
        if(classList) {
            const list = this.node.classList
            if(isArray(classList)) {
                classList.forEach(token => this.classList = token)
            }
            else if(classList.constructor === Object) {
                keys(classList).forEach(token => {
                    if(classList[token]) list.add(token)
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
     * @param {String} className
     */
    set className(className) {
        if(className) this.node.className = className
        else this.node.removeAttribute('class')
    }

    /**
     * Get the class name of the element
     * @returns {String}
     */
    get className() {
        return this.node.className
    }

    /**
     * Get the element index among its sibling elements or -1 if it has no parent
     * @returns {Number}
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
        return this.getInstance(
            this.node.firstElementChild,
            this.constructor.elementAssembler)
    }

    /**
     * Set the unique identifier on the element
     * @param {String} id
     */
    set id(id) {
        this.node.id = id
    }

    /**
     * Get the unique identifier of the element
     * @returns {String}
     */
    get id() {
        return this.node.id
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get lastElementChild() {
        return this.getInstance(
            this.node.lastElementChild,
            this.constructor.elementAssembler)
    }

    /**
     * @returns {String}
     */
    get localName() {
        return this.node.localName
    }

    /**
     * @returns {String|null}
     */
    get namespaceURI() {
        return this.node.namespaceURI
    }

    /**
     * @param {ParentNodeAssembler|*} parentNode
     */
    set parentNode(parentNode) {
        if(parentNode instanceof DocumentAssembler) {
            parentNode.documentElement = this.node
        }
        else {
            if(parentNode instanceof Document) {
                const element = parentNode.documentElement
                if(element) parentNode.removeChild(element)
            }
            super.parentNode = parentNode
        }
    }

    /**
     * @returns {ParentNodeAssembler|*}
     */
    get parentNode() {
        return super.parentNode
    }

    /**
     * @return {String}
     */
    get prefix() {
        return this.node.prefix
    }

    /**
     * Get a previous sibling of the element
     * @returns {ChildNodeAssembler|null|*}
     */
    get previousElementSibling() {
        return this.getInstance(
            this.node.previousElementSibling,
            this.constructor.elementAssembler)
    }

    /**
     * @return {String}
     */
    get tagName() {
        return this.node.tagName
    }

    /**
     * Get a next sibling of the element
     * @returns {ChildNodeAssembler|null|*}
     */
    get nextElementSibling() {
        return this.getInstance(
            this.node.nextElementSibling,
            this.constructor.elementAssembler)
    }

    /**
     * Create the specified Element node
     * @param {*} [init]
     * @returns {Element|*} created element
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
     * @returns {Function}
     */
    static get attrAssembler() {
        return AttrAssembler
    }

    /**
     * @returns {Function}
     */
    static get documentAssembler() {
        return DocumentAssembler
    }

    /**
     * @returns {Function}
     */
    static get elementAssembler() {
        return ElementAssembler
    }

    /**
     * @returns {String}
     */
    static get initPropertyName() {
        return INIT_PROPERTY_NAME
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return Element
    }

    /**
     * The local name of the element node
     * @returns {String}
     */
    static get localName() {
        return this === ElementAssembler?
            LOCAL_NAME :
            this.name.toLowerCase()
    }

    /**
     * Default namespace URI
     * @returns {String}
     */
    static get namespace() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * The XML namespace prefix
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
        return this.localName
    }
}

/**
 * Element assembler factory
 * @param {*} init
 * @returns {ElementAssembler}
 */
export function element(...init) {
    return new ElementAssembler(...init)
}

const LOCAL_NAME = element.name
