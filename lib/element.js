import { ParentNodeAssembler } from './parentnode'
import { AttrAssembler } from './attr'
import {
    DEFAULT_NAMESPACE_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    TYPE_STRING,
    TOKEN_SEPARATOR_RE,
    DEFAULT_ELEMENT_NAME,
    NO_PARENT_INDEX,
} from './defaults'

const { isArray, prototype : { indexOf } } = Array
const { keys } = Object

const { Attr } = Window

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
        if(init.constructor !== Object) {
            this.children = init
            return this.node
        }
        else return super.init(init)
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
     * @returns {Array} token list
     */
    get classList() {
        return this.node.className.split(TOKEN_SEPARATOR_RE)
    }

    /**
     * @param {*} attr
     */
    set attr(attr) {
        if(attr instanceof AttrAssembler) {
            attr.ownerElement = this.node
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
                if(attr) this.attr = attr
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
        return Array.from(this.node.children)
    }

    /**
     * Get the node index among its sibling elements or -1 if it has no parent
     * @returns {Number}
     */
    get index() {
        const parent = this.parentNode
        if(parent) return indexOf.call(parent.children, this.node)
        else return NO_PARENT_INDEX
    }

    /**
     * Create the specified element node
     * @param {String} [namespaceURI]
     * @param {String} [qualifiedName]
     * @returns {Element|*} created element
     */
    static create({
        namespaceURI = this.namespaceURI,
        qualifiedName = this.qualifiedName
    } = this) {
        return this.document.createElementNS(namespaceURI, qualifiedName)
    }

    /**
     * Default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
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
     * The XML Schema namespace prefix
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
        return this === ElementAssembler?
            DEFAULT_ELEMENT_NAME :
            this.name
    }

    /**
     * @param {*} init
     * @returns {ElementAssembler}
     */
    static instance(init) {
        return new this(init)
    }
}

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
 * Element assembler factory
 * @param {*} init
 * @returns {ElementAssembler}
 */
export function element(init) {
    return new ElementAssembler(init)
}
