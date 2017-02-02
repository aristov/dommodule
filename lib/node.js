/**
 * @module dommodule
 * @class NodeAssembler
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @licence MIT
 */

const { isArray } = Array

export class NodeAssembler {

    /**
     * Create the new assembler instance
     * Instantiate and initialize the node if the source is passed
     * @param {Node|{}} [source] node or descriptor
     * @param {{}|String|Node|ElementAssembler|Array} [init] initializer / children
     */
    constructor(source, init) {
        if(source) this.assemble(source, init)
    }

    /**
     * Instantiate and initialize the specified node
     * @param {Node|{}} source node or descriptor
     * @param {{}|String|Node|ElementAssembler|Array} [init] initializing object
     * @returns {Node} instantiated and initialized DOM node
     */
    assemble(source, init) {
        if(source instanceof Node) this.node = source
        else this.create(source)
        return init? this.init(init) : this.node
    }

    /**
     * Instantiate the given node
     * @param {*} descriptor
     * @returns {*}
     */
    create(descriptor) {
        return this.node = descriptor
    }

    /**
     * Initialize the node with the defined properties
     * @param {*} init NodeInit object
     * @returns {Node|*} initialized element
     */
    init(init) {
        const node = this.node
        if(init && init.constructor !== Object) {
            this.childNodes = init
            return node
        }
        for(let prop in init) {
            const value = init[prop]
            if(value !== undefined) {
                if(prop in this) this[prop] = value
                else if(prop in node) node[prop] = value
                else this.onmismatch(prop, value)

            }
        }
        return node
    }

    /**
     * The init mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    onmismatch(prop, value) {
        mismatchWarn(prop, value, this.constructor.name)
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
     * Replace or append the first child of the node
     * @param {Node} firstChild
     */
    set firstChild(firstChild) {
        const node = this.node
        const child = this.firstChild
        if(child) node.replaceChild(firstChild, child)
        else node.appendChild(firstChild)
    }

    /**
     * Get the first child of the node
     * @returns {Node}
     */
    get firstChild() {
        return this.node.firstChild
    }

    /**
     * Replace or append the last child of the node
     * @param {Node} lastChild
     */
    set lastChild(lastChild) {
        const node = this.node
        const child = this.lastChild
        if(child) node.replaceChild(lastChild, child)
        else node.appendChild(lastChild)
    }

    /**
     * Get the last child of the node
     * @returns {Node}
     */
    get lastChild() {
        return this.node.lastChild
    }

    /**
     * Replace or insert the previous sibling of the node
     * @param {Node} previousSibling
     */
    set previousSibling(previousSibling) {
        const node = this.node
        const sibling = this.previousSibling
        const parent = node.parentNode
        if(parent) {
            if(sibling) parent.replaceChild(previousSibling, sibling)
            else parent.insertBefore(previousSibling, node)
        }
        else throw Error('set previousSibling: node must have a parent!')
    }

    /**
     * Get the previous sibling of the node
     * @returns {Node}
     */
    get previousSibling() {
        return this.node.previousSibling
    }

    /**
     * Replace or append the next sibling of the node
     * @param {Node} nextSibling
     */
    set nextSibling(nextSibling) {
        const node = this.node
        const sibling = this.nextSibling
        const parent = node.parentNode
        if(parent) {
            if(sibling) parent.replaceChild(nextSibling, sibling)
            else parent.appendChild(nextSibling)
        }
        else throw Error('set nextSibling: node must have a parent!')
    }

    /**
     * Get the next sibling of the node
     * @returns {Node}
     */
    get nextSibling() {
        return this.node.nextSibling
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
        if(parent) return parent.childNodes.indexOf(this.node)
        else return -1
    }

    /**
     * Not implemented:
     *  nodeValue
     *  parentElement
     *  firstElementChild
     *  lastElementChild
     *  previousElementSibling
     *  nextElementSibling
     */
}

Object.defineProperty(NodeAssembler.prototype, 'node', { writable : true, value : null })

/**
 * Send the console warning on the init mismatch
 * @param {String} prop
 * @param {String} value
 * @param {String} name
 */
function mismatchWarn(prop, value, name) {
    const propval = [prop, `"${ value }"`].join('=')
    console.warn(`The property ${ propval } is not found on the ${ name } instance!`)
}
