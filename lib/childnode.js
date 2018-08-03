import { NodeAssembler } from './node'

const { isArray, prototype : { indexOf } } = Array
const { Node : { ATTRIBUTE_NODE }, document } = window
const { getNodeOf } = NodeAssembler
const NO_PARENT_INDEX = -1

/**
 * @see https://www.w3.org/TR/dom/#interface-childnode
 * @abstract
 */
export class ChildNodeAssembler extends NodeAssembler {
    /**
     * @param {ChildNodeAssembler|Node|string|*} siblings
     */
    after(...siblings) {
        this.node.after(...flatten(siblings).map(sibling => {
            const node = getNodeOf(sibling) || sibling
            return node.nodeType === ATTRIBUTE_NODE?
                node.ownerElement :
                node
        }))
    }

    /**
     * @param {ChildNodeAssembler|Node|string|*} siblings
     */
    before(...siblings) {
        this.node.before(...flatten(siblings).map(sibling => {
            const node = getNodeOf(sibling) || sibling
            return node.nodeType === ATTRIBUTE_NODE?
                node.ownerElement :
                node
        }))
    }

    /**
     * Remove node from tree
     */
    remove() {
        this.node.remove()
    }

    /**
     * @param {ChildNodeAssembler|Node|string|*} objects
     */
    replaceWith(...objects) {
        this.node.replaceWith(...flatten(objects).map(object => {
            const node = getNodeOf(object) || object
            return node.nodeType === ATTRIBUTE_NODE?
                node.ownerElement :
                node
        }))
    }

    /**
     * Get the node index among its sibling nodes or -1 if it has no parent
     * @returns {number}
     */
    get index() {
        const parentNode = this.node.parentNode
        return parentNode?
            indexOf.call(parentNode.childNodes, this.node) :
            NO_PARENT_INDEX
    }
    
    /**
     * Get a next sibling of the element
     * @returns {ElementAssembler|*|null}
     */
    get nextElementSibling() {
        return this.getInstanceOf(this.node.nextElementSibling)
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} nextSibling
     */
    set nextSibling(nextSibling) {
        if(nextSibling.parentNode) {
            nextSibling.before(this.node)
        }
        else if(this.parentNode) {
            this.after(nextSibling)
        }
        else document.createDocumentFragment().append(this.node, getNodeOf(nextSibling))
    }

    /**
     * Get a next sibling of the node
     * @returns {ChildNodeAssembler|*|null}
     */
    get nextSibling() {
        return this.getInstanceOf(this.node.nextSibling)
    }

    /**
     * Get a previous sibling of the element
     * @returns {ElementAssembler|*|null}
     */
    get previousElementSibling() {
        return this.getInstanceOf(this.node.previousElementSibling)
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} previousSibling
     */
    set previousSibling(previousSibling) {
        if(previousSibling.parentNode) {
            previousSibling.after(this.node)
        }
        else if(this.parentNode) {
            this.before(previousSibling)
        }
        else document.createDocumentFragment().append(getNodeOf(previousSibling), this.node)
    }

    /**
     * Get a previous sibling of the node
     * @returns {ChildNodeAssembler|*|null}
     */
    get previousSibling() {
        return this.getInstanceOf(this.node.previousSibling)
    }
    
    /**
     * @returns {ElementAssembler|*|null}
     */
    get parentElement() {
        return this.getInstanceOf(this.node.parentElement)
    }

    /**
     * Append the node to the specified parent
     * @param {ParentNodeAssembler|ParentNode|*|null} parentNode
     */
    set parentNode(parentNode) {
        if(parentNode) {
            parentNode.append(this.node)
        }
        else this.remove()
    }

    /**
     * Get the parent node
     * @returns {ParentNodeAssembler|*|null}
     */
    get parentNode() {
        return this.getInstanceOf(this.node.parentNode)
    }

    /**
     * @param {array} array
     * @returns {array}
     */
    static flatten(array) {
        const result = []
        array.forEach(item => {
            if(isArray(item)) {
                result.push(...flatten(item))
            }
            else if(item) {
                const name = item.constructor.name
                if(name === 'NodeList' || name === 'HTMLCollection') {
                    result.push(...Array.from(item))
                }
                else result.push(item)
            }
        })
        return result
    }
}

const { flatten } = ChildNodeAssembler

NodeAssembler.ChildNodeAssembler = ChildNodeAssembler
