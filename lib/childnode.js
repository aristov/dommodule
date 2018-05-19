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
     * @param {ChildNodeAssembler|Node|String} siblings
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
     * @param {ChildNodeAssembler|Node|String} siblings
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
     * @param {ChildNodeAssembler|Node|String} objects
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
        return this.getInstanceOf(this.node.parentElement)
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
