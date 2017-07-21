import { ChildNodeAssembler } from './childnode'

const { isArray, prototype : { forEach } } = Array

/**
 * ParentNode DOM interface assembler
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    append(...childNodes) {
        childNodes.forEach(child => {
            if(child instanceof ChildNodeAssembler) {
                child.parentNode = this.node
            }
            else this.node.append(child)
        })
    }

    /**
     * Append the child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    set childNodes(childNodes) {
        const node = this.node
        if(node.hasChildNodes()) {
            forEach.call(node.childNodes, child => child.remove())
        }
        if(isArray(childNodes)) {
            childNodes.forEach(child => this.append(child))
        }
        else if(childNodes) this.append(childNodes)
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
