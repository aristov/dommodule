import { TYPE_STRING } from './const'
import { ChildNodeAssembler } from './childnode'

const { isArray, prototype : { forEach, map } } = Array
const { document } = window
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
     */
    appendChild(child) {
        if(child instanceof ChildNodeAssembler) {
            child.parentNode = this.node
        }
        else if(typeof child === TYPE_STRING) {
            this.node.appendChild(document.createTextNode(child))
        }
        else this.node.appendChild(child)
    }

    /**
     * @param {ChildNodeAssembler|Node|*} object
     * @returns {Boolean}
     */
    contains(object) {
        return this.node.contains(this.constructor.getNodeOf(object))
    }

    /**
     * @param {*} init
     */
    create(init) {
        if(init && init.constructor === Object) {
            super.create(init)
        }
        else super.create()
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
        if(node instanceof ChildNodeAssembler) {
            node = node.node
        }
        if(child instanceof ChildNodeAssembler) {
            child = child.node
        }
        const result = this.node.insertBefore(node, child)
        return this.getInstanceOf(result, this.constructor.childNodeAssembler)
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
        this.node.prepend(...items.map(child => {
            return child instanceof ChildNodeAssembler?
                child.node :
                child
        }))
    }

    /**
     * @param {String} selectors
     * @returns {ElementAssembler}
     */
    querySelector(selectors) {
        return this.getInstanceOf(
            this.node.querySelector(selectors),
            this.constructor.childNodeAssembler)
    }

    /**
     * @param {String} selectors
     * @returns {Array}
     */
    querySelectorAll(selectors) {
        const nodes = this.node.querySelectorAll(selectors)
        const assembler = this.constructor.childNodeAssembler
        const handler = node => this.getInstanceOf(node, assembler)
        return map.call(nodes, handler)
    }

    /**
     * @param {ChildNodeAssembler|Node|*} child
     */
    removeChild(child) {
        if(child instanceof ChildNodeAssembler) {
            child.remove()
        }
        else this.node.removeChild(child)
    }

    /**
     * @param {ChildNodeAssembler|Node|*} node
     * @param {ChildNodeAssembler|Node|*} child
     * @returns {ChildNodeAssembler|*}
     */
    replaceChild(node, child) {
        if(node instanceof ChildNodeAssembler) {
            node = node.node
        }
        if(child instanceof ChildNodeAssembler) {
            child = child.node
        }
        const result = this.node.replaceChild(node, child)
        return this.getInstanceOf(result, this.constructor.childNodeAssembler)
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
        if(this.node.hasChildNodes()) {
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
        return map.call(this.node.childNodes, node => {
            return this.getInstanceOf(node, this.constructor.childNodeAssembler)
        })
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get firstChild() {
        return this.getInstanceOf(this.node.firstChild, this.constructor.childNodeAssembler)
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get lastChild() {
        return this.getInstanceOf(this.node.lastChild, this.constructor.childNodeAssembler)
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
     * @returns {Function} ChildNodeAssembler
     */
    static get childNodeAssembler() {
        return ChildNodeAssembler
    }

    /**
     * @returns {String}
     */
    static get initPropertyName() {
        return INIT_PROPERTY_NAME
    }
}
