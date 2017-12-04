import { NO_PARENT_INDEX } from './const'
import { NodeAssembler } from './node'

const { prototype : { indexOf } } = Array

/**
 * ChildNode DOM interface assembler
 */
export class ChildNodeAssembler extends NodeAssembler {
    /**
     * @param {(NodeAssembler|Node|String)[]} items
     */
    after(...items) {
        this.node.after(...items.map(item => {
            return item instanceof NodeAssembler?
                item.node :
                item
        }))
    }
    
    /**
     * @param {(NodeAssembler|Node|String)[]} items
     */
    before(...items) {
        this.node.before(...items.map(item => {
            return item instanceof NodeAssembler?
                item.node :
                item
        }))
    }

    /**
     * Remove node from tree
     */
    remove() {
        if(this.parentNode) {
            this.parentNode.removeChild(this.node)
        }
    }

    /**
     * @param {(NodeAssembler|Node|String)[]} items
     */
    replaceWith(...items) {
        this.node.replaceWith(...items.map(item => {
            return item instanceof NodeAssembler?
                item.node :
                item
        }))
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
        return this.getInstance(this.node.parentNode)
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
        return this.getInstance(this.node.parentElement)
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
}
