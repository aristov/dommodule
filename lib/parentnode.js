import { ChildNodeAssembler } from './childnode'

const { isArray } = Array

/**
 * ParentNode DOM interface assembler
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Append child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    append(...childNodes) {
        childNodes.forEach(child => {
            if(isArray(child)) {
                child.forEach(node => this.append(node))
            }
            else if(child instanceof ChildNodeAssembler) {
                child.parentNode = this.node
            }
            else if(child) this.node.append(child)
        })
    }

    appendChild(child) {
        this.node.appendChild(child instanceof ChildNodeAssembler?
            child.node :
            child)
    }

    /**
     * Replace child nodes to the node
     * @param {String|Node|ChildNodeAssembler|Array|*} childNodes
     */
    set childNodes(childNodes) {
        if(this.node.hasChildNodes()) {
            this.childNodes.forEach(child => child.remove())
        }
        this.append(childNodes)
    }

    /**
     * Get an array of child nodes
     * @returns {*} {Array}
     */
    get childNodes() {
        return Array.from(this.node.childNodes).map(node => {
            return this.getInstance(node)
        })
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
