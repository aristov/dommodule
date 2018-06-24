import { TYPE_FUNCTION, TYPE_STRING, flatten } from './common'
import { AttrAssembler } from './attr'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { prototype : { forEach, map } } = Array
const { Attr, Node, document } = window
const { getNodeOf } = NodeAssembler
const DEFAULT_PROPERTY_NAME = 'childNodes'

/**
 * @see https://www.w3.org/TR/dom/#interface-parentnode
 * @abstract
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Append child nodes to the node
     * @param {string|Node|ChildNodeAssembler|array|*} childNodes
     */
    append(...childNodes) {
        const node = this.node
        flatten(childNodes).forEach(child => {
            if(child instanceof ChildNodeAssembler || child instanceof AttrAssembler) {
                child.parentNode = node
            }
            else node.append(child)
        })
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
     * @returns {boolean}
     */
    contains(object) {
        return this.node.contains(getNodeOf(object))
    }

    /**
     * @param {class|string|*} subject - ElementAssembler or AttrAssembler subclass or selector
     * @param {function|string} [filter]
     * @returns {ElementAssembler|AttrAssembler|*|null}
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
            const isAttr = AttrAssembler.isPrototypeOf(subject)
            const element = this.getInstanceOf(node, !isAttr && !isString && subject)
            return isAttr?
                element.getAttributeNode(subject) :
                element
        }
        return null
    }

    /**
     * @param {class|string|*} subject - ElementAssembler or AttrAssembler subclass or selector
     * @param {function|string} [filter]
     * @returns {array.ElementAssembler|array.AttrAssembler|*}
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
        const isAttr = AttrAssembler.isPrototypeOf(subject)
        const results = map.call(nodeList, node => {
            const element = this.getInstanceOf(node, !isAttr && !isString && subject)
            return isAttr?
                element.getAttributeNode(subject) :
                element
        })
        return typeof filter === TYPE_FUNCTION?
            results.filter(filter) :
            results
    }

    /**
     * @returns {boolean}
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
     * @param {string|Node|ChildNodeAssembler|array|*} childNodes
     */
    prepend(...childNodes) {
        this.node.prepend(...flatten(childNodes).map(child => {
            const node = getNodeOf(child) || child
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
     * @param {string|Node|ChildNodeAssembler|array|*} childNodes
     */
    set childNodes(childNodes) {
        if(this.hasChildNodes()) {
            Array.from(this.node.childNodes).forEach(child => child.remove())
        }
        this.append(childNodes)
    }

    /**
     * Get an array of child nodes
     * @returns {*} {array}
     */
    get childNodes() {
        return map.call(this.node.childNodes, node => this.getInstanceOf(node))
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
     * @returns {ElementAssembler[]}
     */
    get children() {
        return map.call(this.node.children, node => this.getInstanceOf(node))
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} firstChild
     */
    set firstChild(firstChild) {
        this.prepend(firstChild)
    }

    /**
     * @returns {ChildNodeAssembler|*|null}
     */
    get firstChild() {
        return this.getInstanceOf(this.node.firstChild)
    }

    /**
     * @param {ElementAssembler|Element|*} firstElementChild
     */
    set firstElementChild(firstElementChild) {
        this.prepend(firstElementChild)
    }

    /**
     * @returns {ElementAssembler|*|null}
     */
    get firstElementChild() {
        return this.getInstanceOf(this.node.firstElementChild)
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} lastChild
     */
    set lastChild(lastChild) {
        this.append(lastChild)
    }

    /**
     * @returns {ChildNodeAssembler|*|null}
     */
    get lastChild() {
        return this.getInstanceOf(this.node.lastChild)
    }

    /**
     * @param {ElementAssembler|Element|*} lastElementChild
     */
    set lastElementChild(lastElementChild) {
        this.append(lastElementChild)
    }

    /**
     * @returns {ChildNodeAssembler|*|null}
     */
    get lastElementChild() {
        return this.getInstanceOf(this.node.lastElementChild)
    }

    /**
     * Set a text content of the node
     * @param {string} textContent
     */
    set textContent(textContent) {
        this.node.textContent = textContent
    }

    /**
     * Get a text content of the node
     * @returns {string}
     */
    get textContent() {
        return this.node.textContent
    }

    /**
     * @returns {string}
     * @override
     */
    static get defaultPropertyName() {
        return DEFAULT_PROPERTY_NAME
    }
}

NodeAssembler.ParentNodeAssembler = ParentNodeAssembler
