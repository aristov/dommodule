import { NodeAssembler } from './node'
import { NodeInit } from './nodeinit'

const { isArray, prototype : { forEach } } = Array
const { document } = window

/**
 * namespaceURI
 * tagName
 *
 * attributes
 * children
 *
 * id
 * className
 * classList
 *
 * [slot]
 * [shadowRoot]
 *
 * nextElementSibling
 * previousElementSibling
 */
export class ElementAssembler extends NodeAssembler {

    /**
     *
     * @param object
     * @param init
     */
    constructor(object, init) {
        if(typeof object === 'string') this.assemble(object, init)
        else if(object instanceof Node) {
            this.node = object
            if(init) this.init(init)
        }
    }

    /**
     *
     * @param {String} id
     */
    set id(id) {
        this.node.id = id
    }

    /**
     *
     * @returns {String}
     */
    get id() {
        return this.node.id
    }

    /**
     *
     * @param {String} className
     */
    set className(className) {
        this.node.className = className
    }

    /**
     *
     * @returns {String}
     */
    get className() {
        return this.node.className
    }

    /**
     *
     * @param {Array} classList
     */
    set classList(classList) {
        this.node.classList.add(...classList)
    }

    /**
     *
     * @returns {Array}
     */
    get classList() {
        return this.node.className.split(' ')
    }

    /**
     * Set content attributes on the element
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
     * @returns {{}}
     */
    get attributes() {
        const attributes = {}
        const handler = ({ name, value }) => attributes[name] = value
        forEach.call(this.node.attributes, handler)
        return attributes
    }

    /**
     *
     * @param {*} children
     */
    set children(children) {
        if(isArray(children)) {
            children.forEach(child => this.children = child)
        }
        else if(children) {
            if(children instanceof NodeAssembler) children.parentNode = this.node
            else {
                this.node.appendChild(typeof children === 'string'?
                    document.createTextNode(children) :
                    children)
            }
        }
    }

    /**
     *
     * @returns {Array}
     */
    get children() {
        return Array.from(this.node.children)
    }

    /**
     * Create and initialize the specified element node
     * @param {String} tagName
     * @param {{}|String|Node|ElementAssembler|Array} [init] NodeInit object
     * @returns {Element} created and initialized DOM `Element`
     */
    assemble(tagName, init) {
        this.create(tagName)
        return init? this.init(init) : this.node
    }

    /**
     * Create the specified element node
     * @param {String} tagName
     * @returns {Element|*} created element
     */
    create(tagName) {
        /**
         * Just created node, assigned to the assembler instance
         * @type {Element|*}
         */
        const { namespaceURI } = this.constructor
        return this.node = document.createElementNS(namespaceURI, tagName)
    }

    /**
     * Initialize the element with defined properties
     * @param {*} init NodeInit object
     * @returns {Element|*} initialized element
     */
    init(init) {
        init = NodeInit(init)
        const node = this.node
        for(let prop in init) {
            const value = init[prop]
            if(value !== undefined) {
                if(prop in this) this[prop] = value
                else if(prop in node) node[prop] = value
            }
        }
        return node
    }

    /**
     *
     * @returns {null}
     */
    static get namespaceURI() {
        return null
    }
}

Object.defineProperty(ElementAssembler.prototype, 'node', { writable : true, value : null })
