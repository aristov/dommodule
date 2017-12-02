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

function attrset(attrset, { name, value }) {
    attrset[name] = value
    return attrset
}

/**
 * Element DOM node assembler
 */
export class ElementAssembler extends ParentNodeAssembler {

    /**
     * @param {Function} assembler
     * @returns {ElementAssembler|AttrAssembler|null}
     */
    closest(assembler) {
        const node = this.node.closest(assembler.selector)
        if(node) {
            const element = assembler.getInstance(node)
            return assembler.prototype instanceof AttrAssembler?
                element.getAttributeNode(assembler) :
                element
        }
        else return null
    }

    /**
     * this.setAttribute(AttrAssembler, 'foobar')
     * this.setAttribute('attr', 'foobar')
     *
     * @param {Function|String} attr
     * @param {*} value
     */
    setAttribute(attr, value) {
        const instance = this.getAttributeNode(attr)
        if(instance) instance.value = value
        else if(typeof attr === TYPE_FUNCTION) {
            this.setAttributeNode(new attr({ value }))
        }
        else this.node.setAttribute(attr, value)
    }

    /**
     * this.getAttribute(AttrAssembler)
     * this.getAttribute('attr')
     *
     * @param {Function|String} attr
     * @returns {String}
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
            const { namespaceURI, name } = attr.node
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
     * Set the class name of the element
     * @param {String} className
     */
    set className(className) {
        this.node.className = className
    }

    /**
     * Get the class name of the element
     * @returns {String}
     */
    get className() {
        return this.node.className
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
     * @returns {ChildNodeAssembler|*}
     */
    get firstElementChild() {
        return this.getInstance(
            this.node.firstElementChild,
            this.constructor.elementAssembler)
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
     * Get a next sibling of the element
     * @returns {ChildNodeAssembler|null|*}
     */
    get nextElementSibling() {
        return this.getInstance(
            this.node.nextElementSibling,
            this.constructor.elementAssembler)
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
     * The local name of the element node
     * @returns {String}
     */
    static get localName() {
        return this === ElementAssembler? element.name : this.name.toLowerCase()
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
    static get attrAssembler() {
        return AttrAssembler
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
        return Element
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
