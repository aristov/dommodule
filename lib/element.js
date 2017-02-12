import { NodeAssembler } from './node'

const DEFAULT_NAMESPACE_PREFIX = ''
const DEFAULT_NAMESPACE_URI = ''
const XML_NAMESPACE_SEPARATOR = ':'

const { isArray, prototype : { forEach, indexOf } } = Array
const { keys } = Object
const { document } = window

export class ElementAssembler extends NodeAssembler {

    /**
     * Create the specified element node
     * @param {{}|String|*} descriptor
     * @param {String} [descriptor.namespaceURI]
     * @param {String} descriptor.qualifiedName
     * @returns {Element|*} created element
     */
    create(descriptor) {
        const constructor = this.constructor
        if(typeof descriptor === 'string') {
            const node = document.createElementNS(constructor.namespaceURI, descriptor)
            return super.create(node)
        }
        else {
            const {
                namespaceURI = constructor.namespaceURI,
                qualifiedName = constructor.qualifiedName
            } = descriptor || constructor
            return super.create(document.createElementNS(namespaceURI, qualifiedName))
        }
    }

    /**
     * Set the unique identifier of the element
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
     * @param {Object} classList token / token list / token-boolean dict {String|Array|{}}
     */
    set classList(classList) {
        if(classList) {
            const list = this.node.classList
            if(isArray(classList)) {
                classList.forEach(token => this.classList = token)
            }
            else if(typeof classList === 'string') list.add(classList)
            else keys(classList).forEach(token => classList[token] && list.add(token))
        }
    }

    /**
     * Get the class list of the element as an array
     * @returns {Object} token list {Array}
     */
    get classList() {
        return this.node.className.split(' ')
    }

    /**
     * Set the content attributes of the element
     * @param {{}} attributes dictionary object
     */
    set attributes(attributes) {
        const node = this.node
        for(let name in attributes) {
            const value = attributes[name]
            if(typeof value === 'string') node.setAttribute(name, value)
        }
    }

    /**
     * Get the content attributes of the element
     * @returns {{}}
     */
    get attributes() {
        const attributes = {}
        const handler = ({ name, value }) => attributes[name] = value
        forEach.call(this.node.attributes, handler)
        return attributes
    }

    /**
     * Set the children of the element
     * @param {*} children
     */
    set children(children) {
        this.childNodes = children
    }

    /**
     * Get the children of the element
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
        else return -1
    }

    /*
     * Default qualified name
     * @returns {String}
    static get qualifiedName() {
        return DEFAULT_QUALIFIED_NAME
    }
     */

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
        return this.name[0].toLowerCase() + this.name.slice(1)
    }

    /**
     * The qualified name of the element node
     * @returns {String}
     */
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + XML_NAMESPACE_SEPARATOR + localName :
            localName
    }

    /**
     * Default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }
}

/**
 * Element assembler factory
 * @param {{}|String} object
 * @param {{}} init
 * @returns {ElementAssembler}
 */
export function element(object, init) {
    return new ElementAssembler(object, init)
}
