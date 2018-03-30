import { NO_PARENT_INDEX } from './const'
import { NodeAssembler } from './node'

const { prototype : { indexOf } } = Array
const { getNodeOf } = NodeAssembler

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-childnode}
 */
export class ChildNodeAssembler extends NodeAssembler {
    /**
     * @param {NodeAssembler|Node|String} items
     */
    after(...items) {
        this.node.after(...items.map(item => getNodeOf(item)))
    }

    /**
     * @param {NodeAssembler|Node|String} items
     */
    before(...items) {
        this.node.before(...items.map(item => getNodeOf(item)))
    }

    /**
     * Remove node from tree
     */
    remove() {
        this.node.remove()
    }

    /**
     * @param {NodeAssembler|Node|String} items
     */
    replaceWith(...items) {
        this.node.replaceWith(...items.map(item => getNodeOf(item)))
    }

    /**
     * Get the node index among its sibling nodes or -1 if it has no parent
     * @returns {Number}
     */
    get index() {
        const parentNode = this.node.parentNode
        return parentNode?
            indexOf.call(parentNode.childNodes, this.node) :
            NO_PARENT_INDEX
    }

    /**
     * Get a next sibling of the node
     * @returns {ChildNodeAssembler|null|*}
     */
    get nextSibling() {
        return this.getInstanceOf(this.node.nextSibling)
    }

    /**
     * Get a previous sibling of the node
     * @returns {ChildNodeAssembler|null|*}
     */
    get previousSibling() {
        return this.getInstanceOf(this.node.previousSibling)
    }

    /**
     * @param {ElementAssembler} parentElement
     */
    set parentElement(parentElement) {
        parentElement.appendChild(this.node)
    }

    /**
     * @returns {ElementAssembler}
     */
    get parentElement() {
        return this.getInstanceOf(this.node.parentElement, this.constructor.elementAssembler)
    }

    /**
     * Append the node to the specified parent
     * @param {ParentNodeAssembler|*} parentNode
     */
    set parentNode(parentNode) {
        parentNode.appendChild(this.node)
    }

    /**
     * Get the parent node
     * @returns {ParentNodeAssembler|*}
     */
    get parentNode() {
        return this.getInstanceOf(this.node.parentNode)
    }
}

NodeAssembler.ChildNodeAssembler = ChildNodeAssembler
