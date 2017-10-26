import { TYPE_STRING } from './const'
import { document } from './dom'
import { ChildNodeAssembler } from './childnode'

const { isArray } = Array

/**
 * ParentNode DOM interface assembler
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Initialize the parent node with defined properties
     * @param {*} init initializing dictionary
     * @returns {Node|*} initialized node
     */
    init(init) {
        if(init) {
            if(init.constructor === Object) super.init(init)
            else this.childNodes = init
        }
    }

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
            child.parentNode = this.node
        }
        else if(typeof child === TYPE_STRING) {
            this.node.appendChild(document.createTextNode(child))
        }
        else this.node.appendChild(child)
    }

    /**
     * @param child
     */
    removeChild(child) {
        if(child instanceof ChildNodeAssembler) {
            child.remove()
        }
        else this.node.removeChild(child)
    }

    /**
     * @param {*} init
     * @returns {Node|*}
     */
    create(init) {
        return init && init.constructor === Object?
            super.create(init) :
            super.create()
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
