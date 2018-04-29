import { TYPE_FUNCTION, TYPE_STRING, flatten } from './common'
import { AttrAssembler } from './attr'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { prototype : { forEach, map } } = Array
const { Attr, Node, document } = window
const { getNodeOf } = NodeAssembler
const DEFAULT_PROPERTY_NAME = 'childNodes'

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-parentnode}
 * @abstract
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Append child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    append(...childNodes) {
        flatten(childNodes).forEach(this.appendChild, this)
    }

    /**
     * @param {*} child
     * @returns {ChildNodeAssembler|*}
     */
    appendChild(child) {
        const node = this.node
        if(typeof child === TYPE_STRING) {
            return this.getInstanceOf(node.appendChild(document.createTextNode(child)))
        }
        else if(child instanceof NodeAssembler || child instanceof Node) {
            const instance = this.getInstanceOf(child)
            instance.parentNode = node
            return instance
        }
        else throw TypeError(`Failed to execute 'appendChild' on '${ this.constructor.name }': parameter is not of expected type.`)
    }

    /**
     * @param {ChildNodeAssembler|Node|*} object
     * @returns {Boolean}
     */
    contains(object) {
        return this.node.contains(getNodeOf(object))
    }

    /**
     * @param {Function|String|*} subject
     * @param {Function|String} [filter]
     * @returns {ChildNodeAssembler|*|null}
     */
    find(subject, filter) {
        const isString = typeof subject === TYPE_STRING
        if(typeof filter === TYPE_FUNCTION) {
            const instances = this.findAll(subject, filter)
            return instances[0] || null
        }
        let selector = isString?
            subject :
            subject.selector
        if(typeof filter === TYPE_STRING) {
            selector += filter
        }
        const node = this.node.querySelector(selector)
        if(node) {
            const isAttr = subject === AttrAssembler || AttrAssembler.isPrototypeOf(subject)
            const elementAssembler = isAttr || isString?
                this.constructor.elementAssembler :
                subject
            const element = this.getInstanceOf(node, elementAssembler)
            return isAttr?
                element.getAttributeNode(subject) :
                element
        }
        return null
    }

    /**
     * @param {Function|String|*} subject
     * @param {Function|String} [filter]
     * @returns {ChildNodeAssembler[]|*[]}
     */
    findAll(subject, filter) {
        const isString = typeof subject === TYPE_STRING
        let selector = isString?
            subject :
            subject.selector
        if(typeof filter === TYPE_STRING) {
            selector += filter
        }
        const nodeList = this.node.querySelectorAll(selector)
        const isAttr = subject === AttrAssembler || AttrAssembler.isPrototypeOf(subject)
        const elementAssembler = isAttr || isString?
            this.constructor.elementAssembler :
            subject
        const results = map.call(nodeList, node => {
            const element = this.getInstanceOf(node, elementAssembler)
            return isAttr?
                element.getAttributeNode(subject) :
                element
        })
        return typeof filter === TYPE_FUNCTION?
            results.filter(filter) :
            results
    }

    /**
     * @returns {Boolean}
     */
    hasChildNodes() {
        return this.node.hasChildNodes()
    }

    /**
     * @param {ChildNodeAssembler|Node|*} node
     * @param {ChildNodeAssembler|Node|*} child
     * @returns {ChildNodeAssembler|*}
     */
    insertBefore(node, child) {
        return this.getInstanceOf(this.node.insertBefore(getNodeOf(node), getNodeOf(child)))
    }

    /**
     * Prepend child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    prepend(...childNodes) {
        this.node.prepend(...flatten(childNodes).map(child => {
            const node = getNodeOf(child)
            return node instanceof Attr?
                node.ownerElement :
                node
        }))
    }

    /**
     * @param {ChildNodeAssembler|Node|*} child
     */
    removeChild(child) {
        if(child instanceof ChildNodeAssembler) {
            child.remove()
            return child
        }
        else {
            return this.getInstanceOf(this.node.removeChild(child))
        }
    }

    /**
     * @param {ChildNodeAssembler|Node|*} node
     * @param {ChildNodeAssembler|Node|*} child
     * @returns {ChildNodeAssembler|*}
     */
    replaceChild(node, child) {
        return this.getInstanceOf(this.node.replaceChild(getNodeOf(node), getNodeOf(child)))
    }

    /**
     * Set child nodes of the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    set childNodes(childNodes) {
        if(this.hasChildNodes()) {
            this.childNodes.forEach(child => child.remove())
        }
        this.append(childNodes)
    }

    /**
     * Get an array of child nodes
     * @returns {*} {Array}
     */
    get childNodes() {
        return map.call(this.node.childNodes, node => this.getInstanceOf(node))
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get firstChild() {
        return this.getInstanceOf(this.node.firstChild)
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get lastChild() {
        return this.getInstanceOf(this.node.lastChild)
    }

    /**
     * Set a text content of the node
     * @param {String} textContent
     */
    set textContent(textContent) {
        this.node.textContent = textContent
    }

    /**
     * Get a text content of the node
     * @returns {String}
     */
    get textContent() {
        return this.node.textContent
    }

    /**
     * @returns {String}
     * @override
     */
    static get defaultPropertyName() {
        return DEFAULT_PROPERTY_NAME
    }
}

NodeAssembler.ParentNodeAssembler = ParentNodeAssembler
