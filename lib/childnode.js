import { NO_PARENT_INDEX } from './config'
import { NodeAssembler } from './node'

const { prototype : { indexOf } } = Array

/**
 * ChildNode DOM interface assembler
 */
export class ChildNodeAssembler extends NodeAssembler {
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
        return this.getInstance(this.node.parentNode)
    }

    /**
     * Get a next sibling of the node
     * @returns {ChildNodeAssembler|null|*}
     */
    get nextSibling() {
        return this.getInstance(this.node.nextSibling)
    }

    /**
     * Get a previous sibling of the node
     * @returns {ChildNodeAssembler|null|*}
     */
    get previousSibling() {
        return this.getInstance(this.node.previousSibling)
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
     * Remove node from tree
     */
    remove() {
        const parentNode = this.parentNode
        if(parentNode) parentNode.removeChild(this.node)
    }
}
