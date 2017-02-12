import { NodeAssembler } from './node'

const DEFAULT_NAMESPACE_PREFIX = ''
const DEFAULT_NAMESPACE_URI = ''
const XML_NAMESPACE_SEPARATOR = ':'
const FIRST_LETTER_RE = /^(\w)/

const { isArray, prototype : { forEach, indexOf } } = Array
const { document } = window
const { keys } = Object

function toLowerCase(str) {
    return str.toLowerCase()
}

export class ElementAssembler extends NodeAssembler {

    /**
     * Assemble the specified element node
     * @param [init] initializing dictionary
     * @returns {Node|*}
     */
    assemble(init) {
        if(init && init.constructor !== Object) {
            this.instantiate()
            this.init({ childNodes : init })
            return this.node
        }
        else return super.assemble(init)
    }

    /**
     * Bind the target node to the assembler
     * @param {Node} node
     */
    set node(node) {
        super.node = node
    }

    /**
     * Get the target node
     * @returns {Node}
     */
    get node() {
        return super.node || this.instantiate()
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

    /**
     * Create the specified element node
     * @param {{}|String|*} init
     * @param {String} [init.namespaceURI]
     * @param {String} init.qualifiedName
     * @returns {Element|*} created element
     */
    static create(init) {
        const {
            namespaceURI = this.namespaceURI,
            qualifiedName = this.qualifiedName
        } = init || this
        if(init) {
            if('namespaceURI' in init) delete init.namespaceURI
            if('qualifiedName' in init) delete init.qualifiedName
        }
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
        return this.name.replace(FIRST_LETTER_RE, toLowerCase)
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
     *
     * @returns {Document}
     */
    static get document() {
        return document
    }
}

/**
 * Element assembler factory
 * @param {*} init
 * @returns {ElementAssembler}
 */
export function element(init) {
    return new ElementAssembler(init)
}
