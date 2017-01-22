import { NodeInit } from './nodeinit'

const { isArray, prototype : { reduce } } = Array
const { document } = window

const XML_NS_URI = 'http://www.w3.org/1999/xml'

/**
 * - Assembler for `Element` DOM interface
 * - Provides built-in and adapted interfaces for `Element` initialization
 */
export class XMLDOMAssembler {

    constructor(object, init) {
        if(typeof object === 'string') {
            this.assemble(object, init)
        }
        else if(object instanceof Node) {
            this.node = object
            if(init) this.init(init)
        }
    }

    /**
     * Set content attributes on the element
     * @param {{}} attributes dictionary object
     */
    set attributes(attributes) {
        const node = this.node
        for(let name in attributes) {
            const value = attributes[name]
            if(typeof value === 'string') {
                node.setAttribute(name, value)
            }
        }
    }

    /**
     * @returns {{}}
     */
    get attributes() {
        return reduce.call(this.node.attributes, (res, attr) => {
            res[attr.name] = attr.value
            return res
        }, {})
    }

    set children(children) {
        if(isArray(children)) {
            children.forEach(child => this.children = child)
        }
        else if(children) {
            const child = typeof children === 'string'?
                document.createTextNode(children) :
                children instanceof XMLDOMAssembler?
                    children.node :
                    children
            this.node.appendChild(child)
        }
    }

    get children() {
        return Array.from(this.node.children)
    }

    set id(id) {
        this.node.id = id
    }

    get id() {
        return this.node.id
    }

    set className(className) {
        this.node.className = className
    }

    get className() {
        return this.node.className
    }

    /**
     * Create the specified element node and initialize it by a given property set
     * @param {String} tagName
     * @param {{}|String|Node|XMLDOMAssembler|Array} [init]
     * @returns {Element} created and initialized DOM `Element`
     */
    assemble(tagName, init) {
        this.create(tagName)
        return init? this.init(NodeInit(init)) : this.node
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
        return this.node = document.createElementNS(XML_NS_URI, tagName)
    }

    /**
     * Initialize the element with defined properties
     * @param {{}} init initializing `NodeInit` dictionary object
     * @returns {Element|*} initialized element
     */
    init(init) {
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
}

Object.defineProperty(XMLDOMAssembler.prototype, 'node', { writable : true, value : null })
