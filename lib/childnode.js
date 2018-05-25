import { NO_PARENT_INDEX, flatten } from './common'
import { NodeAssembler } from './node'

const { prototype : { indexOf } } = Array
const { Attr } = window
const { getNodeOf } = NodeAssembler

/**
 * @see https://www.w3.org/TR/dom/#interface-childnode
 * @abstract
 */
export class ChildNodeAssembler extends NodeAssembler {
    /**
     * @param {ChildNodeAssembler|Node|string} siblings
     */
    after(...siblings) {
        this.node.after(...flatten(siblings).map(sibling => {
            const node = getNodeOf(sibling)
            return node instanceof Attr?
                node.ownerElement :
                node
        }))
    }

    /**
     * @param {ChildNodeAssembler|Node|string} siblings
     */
    before(...siblings) {
        this.node.before(...flatten(siblings).map(sibling => {
            const node = getNodeOf(sibling)
            return node instanceof Attr?
                node.ownerElement :
                node
        }))
    }

    /**
     * Remove node from tree
     */
    remove() {
        this.node.remove()
    }

    /**
     * @param {ChildNodeAssembler|Node|string} objects
     */
    replaceWith(...objects) {
        this.node.replaceWith(...flatten(objects).map(object => {
            const node = getNodeOf(object)
            return node instanceof Attr?
                node.ownerElement :
                node
        }))
    }

    /**
     * Get the node index among its sibling nodes or -1 if it has no parent
     * @returns {number}
     */
    get index() {
        const parentNode = this.node.parentNode
        return parentNode?
            indexOf.call(parentNode.childNodes, this.node) :
            NO_PARENT_INDEX
    }

    /**
     * @param {ElementAssembler|Element|*} nextElementSibling
     */
    set nextElementSibling(nextElementSibling) {
        nextElementSibling.before(this.node)
    }

    /**
     * Get a next sibling of the element
     * @returns {ElementAssembler|*|null}
     */
    get nextElementSibling() {
        return this.getInstanceOf(this.node.nextElementSibling)
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} nextSibling
     */
    set nextSibling(nextSibling) {
        nextSibling.before(this.node)
    }

    /**
     * Get a next sibling of the node
     * @returns {ChildNodeAssembler|*|null}
     */
    get nextSibling() {
        return this.getInstanceOf(this.node.nextSibling)
    }

    /**
     * @param {ElementAssembler|Element|*} previousElementSibling
     */
    set previousElementSibling(previousElementSibling) {
        previousElementSibling.after(this.node)
    }

    /**
     * Get a previous sibling of the element
     * @returns {ElementAssembler|*|null}
     */
    get previousElementSibling() {
        return this.getInstanceOf(this.node.previousElementSibling)
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} previousSibling
     */
    set previousSibling(previousSibling) {
        previousSibling.after(this.node)
    }

    /**
     * Get a previous sibling of the node
     * @returns {ChildNodeAssembler|*|null}
     */
    get previousSibling() {
        return this.getInstanceOf(this.node.previousSibling)
    }

    /**
     * @param {ElementAssembler|Element|*} parentElement
     */
    set parentElement(parentElement) {
        parentElement.append(this.node)
    }

    /**
     * @returns {ElementAssembler|*|null}
     */
    get parentElement() {
        return this.getInstanceOf(this.node.parentElement)
    }

    /**
     * Append the node to the specified parent
     * @param {ParentNodeAssembler|ParentNode|*} parentNode
     */
    set parentNode(parentNode) {
        parentNode.append(this.node)
    }

    /**
     * Get the parent node
     * @returns {ParentNodeAssembler|*|null}
     */
    get parentNode() {
        return this.getInstanceOf(this.node.parentNode)
    }
}

NodeAssembler.ChildNodeAssembler = ChildNodeAssembler
