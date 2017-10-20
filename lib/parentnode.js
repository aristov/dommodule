import { TYPE_STRING, document } from './core'
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
            if(child) {
                if(isArray(child)) this.append(...child)
                else this.appendChild(child)
            }
        })
    }

    /**
     * @param {*} child
     */
    appendChild(child) {
        if(child instanceof ChildNodeAssembler) {
            child.parentNode = this
        }
        else if(typeof child === TYPE_STRING) {
            this.node.appendChild(document.createTextNode(child))
            // new TextAssembler({ data : child, parentNode : this })
        }
        else this.node.appendChild(child)
    }

    /**
     * @param child
     */
    removeChild(child) {
        if(child instanceof ChildNodeAssembler) {
            this.node.removeChild(child.node)
        }
        else this.node.removeChild(child)
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
            return this.getInstance(node) || node
        })
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get firstChild() {
        return this.getInstance(this.node.firstChild)
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get lastChild() {
        return this.getInstance(this.node.lastChild)
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
