const { isArray } = Array

export class NodeAssembler {

    /**
     * Create or wrap the specified DOM node
     * @param object
     * @param init
     */
    constructor(object, init) {
        if(object) this.assemble(object, init)
    }

    /**
     * Create and initialize the specified element node
     * @param {Node|{}} object node or descriptor
     * @param {{}|String|Node|ElementAssembler|Array} [init] NodeInit object
     * @returns {Node} created and initialized DOM `Element`
     */
    assemble(object, init) {
        if(object instanceof Node) this.node = object
        else this.create(object)
        return init? this.init(init) : this.node
    }

    /**
     * Stub for inheritance
     * @param {*} object
     * @returns {*}
     */
    create(object) {
        return this.node = object
    }

    /**
     * Initialize the node with defined properties
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
     * Get parent node
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
