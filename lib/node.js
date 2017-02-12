import { EventTargetAssembler } from './target'

const { isArray, prototype : { indexOf } } = Array

export class NodeAssembler extends EventTargetAssembler {

    /**
     *
     * @param init
     * @returns {*}
     */
    instantiate(init) {
        if(init) {
            if('node' in init) {
                this.node = init.node
                delete init.node
                return this.node
            }
            else return super.instantiate(init)
        }
        else return this.node = this.constructor.create(init)
    }

    /**
     *
     * @param {Node} node
     */
    set node(node) {
        this.target = node
    }

    /**
     *
     * @returns {Node}
     */
    get node() {
        return this.target
    }

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
     * Append the child nodes to the node
     * @param {String|Node|NodeAssembler|Array|*} childNodes
     */
    set childNodes(childNodes) {
        if(isArray(childNodes)) {
            childNodes.forEach(child => this.childNodes = child)
        }
        else if(childNodes) {
            if(childNodes instanceof NodeAssembler) {
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

    /**
     * Get the node index among its sibling nodes or -1 if it has no parent
     * @returns {Number}
     */
    get nodeIndex() {
        const parent = this.parentNode
        return parent? indexOf.call(parent.childNodes, this.node) :  -1
    }

    /**
     *
     * @param {{}} init
     * @returns {Node}
     */
    static create(init) {}
}
