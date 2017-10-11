import { NO_PARENT_INDEX } from './core'
import { NodeAssembler } from './node'

const { prototype : { indexOf } } = Array

/**
 * ChildNode DOM interface assembler
 */
export class ChildNodeAssembler extends NodeAssembler {
    /**
     * Append the node to the specified parent
     * @param {Node} parentNode
     */
    set parentNode(parentNode) {
        parentNode.appendChild(this.node)
    }

    /**
     * Get the parent node
     * @returns {Node}
     */
    get parentNode() {
        return this.node.parentNode
    }

    /**
     * Get the node index among its sibling nodes or -1 if it has no parent
     * @returns {Number}
     */
    get index() {
        const parentNode = this.parentNode
        return parentNode?
            indexOf.call(parentNode.childNodes, this.node) :
            NO_PARENT_INDEX
    }

    /**
     * Remove node from tree
     */
    remove() {
        this.node.remove()
    }
}
