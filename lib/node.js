import { EventTargetAssembler } from './eventtarget'

const { Node } = window

/**
 * Node DOM interface assembler
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {*} init
     * @returns {Node|*}
     */
    assemble(init) {
        if(init && init.constructor === Object && init.node instanceof Node) {
            this.node = init.node
            this.init(init)
        }
        else super.assemble(init)
        return this.node
    }

    /**
     * @param {Boolean} deep
     * @returns {NodeAssembler|*}
     */
    cloneNode(deep) {
        return this.getInstance(this.node.cloneNode(deep), this.constructor)
    }

    /**
     * @param {NodeAssembler|Node} object
     * @returns {Number}
     */
    compareDocumentPosition(object) {
        const node = object instanceof NodeAssembler?
            object.node :
            object
        return this.node.compareDocumentPosition(node)
    }

    /**
     * @param {Node|*|null} node
     * @param {Function} [assembler]
     * @returns {TargetAssembler|*}
     */
    getInstance(node, assembler) {
        if(node) {
            const constructor = this.constructor
            if(constructor.hasInstance(node)) {
                return constructor.getInstance(node)
            }
            else {
                return assembler?
                    new assembler({ node }) :
                    constructor.getInstance(node)
            }
        }
        return null
    }

    /**
     * @param {String} namespace
     * @returns {Boolean}
     */
    isDefaultNamespace(namespace) {
        return this.node.isDefaultNamespace(namespace)
    }

    /**
     * @param {NodeAssembler|Node} object
     * @returns {Boolean}
     */
    isEqualNode(object) {
        const node = object instanceof NodeAssembler?
            object.node :
            object
        return this.node.isEqualNode(node)
    }

    /**
     * @param {String} namespace
     * @returns {String|null}
     */
    lookupPrefix(namespace) {
        return this.node.lookupPrefix(namespace)
    }

    /**
     * @param {String} prefix
     * @returns {String|null}
     */
    lookupNamespaceURI(prefix) {
        return this.node.lookupNamespaceURI(prefix)
    }

    /**
     * @returns {String}
     */
    get baseURI() {
        return this.node.baseURI
    }

    /**
     * @param {Node|*} node
     */
    set node(node) {
        if(node !== this.node) {
            const constructor = this.constructor
            if(node instanceof constructor.interface) this.setInstance(node)
            else {
                const message = `Failed to set 'node' on '${ constructor.name }': parameter is not of expected type.`
                throw TypeError(message)
            }
        }
    }

    /**
     * @returns {Node|*}
     */
    get node() {
        return this._target
    }

    /**
     * @returns {String}
     */
    get nodeName() {
        return this.node.nodeName
    }

    /**
     * @returns {Number}
     */
    get nodeType() {
        return this.node.nodeType
    }

    /**
     * @param {String} nodeValue
     */
    set nodeValue(nodeValue) {
        this.node.nodeValue = nodeValue
    }

    /**
     * @returns {String}
     */
    get nodeValue() {
        return this.node.nodeValue
    }

    /**
     * @returns {DocumentAssembler}
     */
    get ownerDocument() {
        return this.getInstance(this.node.ownerDocument)
    }

    /**
     * @returns {window.Node}
     */
    static get interface() {
        return Node
    }
}
