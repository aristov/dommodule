import { TYPE_STRING } from './const'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { isArray, prototype : { forEach, map } } = Array
const { document } = window
const { getNodeOf } = NodeAssembler
const INIT_PROPERTY_NAME = 'childNodes'

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-parentnode}
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Append child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    append(...childNodes) {
        childNodes.forEach(child => {
            if(child) {
                if(isArray(child)) this.append(...child)
                else this.appendChild(child)
            }
        })
    }

    /**
     * @param {*} child
     * @returns {ChildNodeAssembler|*}
     */
    appendChild(child) {
        const node = this.node
        if(child instanceof ChildNodeAssembler) {
            child.parentNode = node
            return child
        }
        else if(typeof child === TYPE_STRING) {
            return this.getInstanceOf(node.appendChild(document.createTextNode(child)))
        }
        else {
            return this.getInstanceOf(node.appendChild(child))
        }
    }

    /**
     * @param {ChildNodeAssembler|Node|*} object
     * @returns {Boolean}
     */
    contains(object) {
        return this.node.contains(getNodeOf(object))
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
     * https://www.w3.org/TR/dom/#dom-node-normalize
     */
    normalize() {
        this.node.normalize()
    }

    /**
     * Prepend child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} items
     */
    prepend(...items) {
        this.node.prepend(...items.map(getNodeOf))
    }

    /**
     * @param {String} selectors
     * @returns {ElementAssembler}
     */
    querySelector(selectors) {
        return this.getInstanceOf(
            this.node.querySelector(selectors),
            this.constructor.elementAssembler)
    }

    /**
     * @param {String} selectors
     * @returns {Array}
     */
    querySelectorAll(selectors) {
        const { elementAssembler } = this.constructor
        return map.call(
            this.node.querySelectorAll(selectors),
            node => this.getInstanceOf(node, elementAssembler))
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
     * @returns {Number}
     */
    get childElementCount() {
        return this.node.childElementCount
    }

    /**
     * Replace child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    set childNodes(childNodes) {
        if(this.hasChildNodes()) {
            forEach.call(this.node.childNodes, child => {
                this.node.removeChild(child)
            })
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
    static get initPropertyName() {
        return INIT_PROPERTY_NAME
    }
}

NodeAssembler.ParentNodeAssembler = ParentNodeAssembler
