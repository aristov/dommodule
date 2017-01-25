import { NodeAssembler } from './node'

const DEFAULT_QUALIFIED_NAME = 'element'
const DEFAULT_NAMESPACE_URI = ''

const { prototype : { forEach } } = Array
const { document } = window

export class ElementAssembler extends NodeAssembler {

    /**
     *
     * @param object
     * @param init
     */
    /*constructor(object, init) {
        if(typeof object === 'string') this.assemble(object, init)
        else if(object instanceof Node) {
            this.node = object
            if(init) this.init(init)
        }
    }*/

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
        this.childNodes = children
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
     * @param {{}} descriptor
     * @param {{}|String|Node|ElementAssembler|Array} [init] NodeInit object
     * @returns {Element} created and initialized DOM `Element`
     */
    assemble(descriptor, init) {
        this.create(descriptor)
        return init? this.init(init) : this.node
    }

    /**
     * Create the specified element node
     * @param {{}|String} descriptor
     * @param {String} descriptor.namespaceURI
     * @param {String} descriptor.qualifiedName
     * @returns {Element|*} created element
     */
    create(descriptor) {
        if(typeof descriptor === 'string') {
            return this.node = document.createElementNS(
                this.constructor.namespaceURI,
                descriptor)
        }
        else {
            const constructor = this.constructor
            const {
                namespaceURI = constructor.namespaceURI,
                qualifiedName = constructor.qualifiedName
            } = descriptor || constructor
            return this.node = document.createElementNS(namespaceURI, qualifiedName)
        }
    }

    static get qualifiedName() {
        return DEFAULT_QUALIFIED_NAME
    }

    /**
     *
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }
}

export function xmlelement(object, init) {
    const assembler = new ElementAssembler(object, init)
    assembler.assemble(object, init)
    return assembler
}
