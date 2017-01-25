const { isArray } = Array

export class NodeAssembler {

    /**
     *
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
     * @returns {Element} created and initialized DOM `Element`
     */
    assemble(object, init) {
        if(object instanceof Node) this.node = object
        else this.create(object)
        return init? this.init(init) : this.node
    }

    create(object) {
        return this.node = object
    }

    /**
     * Initialize the node with defined properties
     * @param {*} init NodeInit object
     * @returns {Element|*} initialized element
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
                else console.warn(`The property ${ prop }="${ value }" is not found on the ${ this.constructor.name } instance!`)
            }
        }
        return node
    }

    set parentNode(parentNode) {
        parentNode.appendChild(this.node)
    }

    get parentNode() {
        return this.node.parentNode
    }

    set childNodes(children) {
        if(isArray(children)) {
            children.forEach(child => this.children = child)
        }
        else if(children) {
            if(children instanceof NodeAssembler) {
                children.parentNode = this.node
            }
            else this.node.append(children)
        }
    }

    get childNodes() {
        return Array.from(this.node.childNodes)
    }

    set firstChild(firstChild) {
        const node = this.node
        const child = this.firstChild
        if(child) node.replaceChild(firstChild, child)
        else node.appendChild(firstChild)
    }

    get firstChild() {
        return this.node.firstChild
    }

    set lastChild(lastChild) {
        const node = this.node
        const child = this.lastChild
        if(child) node.replaceChild(lastChild, child)
        else node.appendChild(lastChild)
    }

    get lastChild() {
        return this.node.lastChild
    }

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

    get previousSibling() {
        return this.node.previousSibling
    }

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

    get nextSibling() {
        return this.node.nextSibling
    }

    set textContent(textContent) {
        this.node.textContent = textContent
    }

    get textContent() {
        return this.node.textContent
    }
}

Object.defineProperty(NodeAssembler.prototype, 'node', { writable : true, value : null })

/**
 * firstElementChild
 * lastElementChild
 * previousElementSibling
 * nextElementSibling
 * parentElement
 * nodeValue
 */
