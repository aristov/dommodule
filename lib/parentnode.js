import { ChildNodeAssembler } from './childnode'

const { isArray } = Array

/**
 * ParentNode DOM interface assembler
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Append the child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    set childNodes(childNodes) {
        if(isArray(childNodes)) {
            childNodes.forEach(child => this.childNodes = child)
        }
        else if(childNodes) {
            if(childNodes instanceof ChildNodeAssembler) {
                childNodes.parentNode = this.node
            }
            else this.node.append(childNodes)
        }
    }

    /**
     * Get an array of child nodes
     * @returns {*} {Array}
     */
    get childNodes() {
        return Array.from(this.node.childNodes)
    }

    /**
     * Set the text content of the node
     * @param {String} textContent
     */
    set textContent(textContent) {
        this.node.textContent = textContent
    }

    /**
     * Get the text content of the node
     * @returns {String}
     */
    get textContent() {
        return this.node.textContent
    }
}
