import { AttrAssembler } from './attr'
import { ChildNodeAssembler } from './childnode'
import { NodeAssembler } from './node'

const { prototype : { map } } = Array
const { Attr, Node } = window
const { getNodeOf } = NodeAssembler
const { flatten } = ChildNodeAssembler
const CHILD_NODES_PROPERTY_NAME = 'childNodes'
const TYPE_FUNCTION = 'function'
const TYPE_STRING = 'string'

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
                element.getAttr(subject) :
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
                element.getAttr(subject) :
                element
        })
        return typeof filter === TYPE_FUNCTION?
            results.filter(filter) :
            results
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
     * Set child nodes of the node
     * @param {string|Node|ChildNodeAssembler|array|*} childNodes
     */
    set childNodes(childNodes) {
        if(this.node.hasChildNodes()) {
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
        if(this.node.hasChildNodes()) {
            Array.from(this.node.childNodes).forEach(child => child.remove())
        }
        this.append(children)
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
        return CHILD_NODES_PROPERTY_NAME
    }
}

NodeAssembler.ParentNodeAssembler = ParentNodeAssembler
