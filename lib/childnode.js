import { NodeAssembler } from './node'

export class ChildNodeAssembler extends NodeAssembler {
    /**
     * Append the node to the specified parent
     * @param {Node} parentNode
     */
    set parentNode(parentNode) {
        const node = this.node
        if(node) parentNode.appendChild(node)
    }

    /**
     * Get the parent node
     * @returns {Node}
     */
    get parentNode() {
        return this.node && this.node.parentNode
    }
}
