import {
    document,
    Attr,
    Document,
    DEFAULT_NAMESPACE_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    NO_PARENT_INDEX,
    TYPE_STRING
} from './core'
import { AttrAssembler } from './attr'
import { DocumentAssembler } from './document'
import { ParentNodeAssembler } from './parentnode'

const { isArray, prototype : { indexOf } } = Array
const { keys } = Object

/**
 * Attributes reduce handler
 * @param {{}} attrset
 * @param {String} name
 * @param {String} value
 * @returns {{}} attrset
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
     * Initialize the element node with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Node|*} initialized node
     */
    init(init) {
        if(init) {
            if(init.constructor === Object) super.init(init)
            else this.children = init
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
            else if(typeof classList === TYPE_STRING) {
                list.add(classList)
            }
            else keys(classList).forEach(token => {
                if(classList[token]) list.add(token)
            })
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
     * @param {*} attr
     */
    setAttributeNode(attr) {
        if(attr instanceof AttrAssembler) {
            attr.ownerElement = this
        }
        else if(attr instanceof Attr) {
            if(attr.namespaceURI) this.node.setAttributeNodeNS(attr)
            else this.node.setAttributeNode(attr)
        }
        else {
            const { namespaceURI, name, value } = attr
            if(namespaceURI) {
                this.node.setAttributeNS(namespaceURI, name, value)
            }
            else this.node.setAttribute(name, value)
        }
    }

    /**
     * @param {*} child
     */
    appendChild(child) {
        if(child instanceof AttrAssembler) {
            child.parentNode = this
        }
        else super.appendChild(child)
    }

    /**
     * Set content attributes on the element
     * @param {*} attrset dictionary object
     */
    set attrset(attrset) {
        if(isArray(attrset)) this.attributes = attrset
        else {
            const node = this.node
            for(let name in attrset) {
                const value = attrset[name]
                if(typeof value === TYPE_STRING) {
                    node.setAttribute(name, value)
                }
            }
        }
    }

    /**
     * Get all content attributes of the element as a dictionary-object
     * @returns {{}}
     */
    get attrset() {
        return this.attributes.reduce(attrset, {})
    }

    /**
     * Set content attributes on the element
     * @param {*} attributes
     */
    set attributes(attributes) {
        if(isArray(attributes)) {
            attributes.forEach(attr => {
                if(attr) this.setAttributeNode(attr)
            })
        }
        else this.attrset = attributes
    }

    /**
     * Get all attributes of the element as an array
     * @returns {Array}
     */
    get attributes() {
        return Array.from(this.node.attributes)
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
        return Array.from(this.node.children).map(node => {
            return this.getInstance(node)
        })
    }

    /**
     * @param {ParentNodeAssembler|*} parentNode
     */
    set parentNode(parentNode) {
        if(parentNode instanceof DocumentAssembler) {
            parentNode.documentElement = this
        }
        else {
            if(parentNode instanceof Document) {
                if(parentNode.documentElement) {
                    parentNode.documentElement.remove()
                }
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
        return this.getInstance(this.node.nextElementSibling)
    }

    /**
     * Get a previous sibling of the element
     * @returns {ChildNodeAssembler|null|*}
     */
    get previousElementSibling() {
        return this.getInstance(this.node.previousElementSibling)
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
            namespaceURI = this.namespaceURI,
            prefix = this.prefix,
            localName = this.localName
        } = init || this
        let qualifiedName = init && init.qualifiedName
        if(!qualifiedName) {
            qualifiedName = prefix?
                prefix + NAMESPACE_SEPARATOR + localName :
                localName
        }
        return document.createElementNS(namespaceURI, qualifiedName)
    }

    /**
     * Default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * The XML namespace prefix
     * @returns {String}
     */
    static get prefix() {
        return DEFAULT_NAMESPACE_PREFIX
    }

    /**
     * The local name of the element node
     * @returns {String}
     */
    static get localName() {
        return this === ElementAssembler? element.name : this.name
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
}

/**
 * Element assembler factory
 * @param {*} init
 * @returns {ElementAssembler}
 */
export function element(...init) {
    return new ElementAssembler(...init)
}
