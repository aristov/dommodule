import { EventTargetAssembler } from './eventtarget'

const { Node } = window
const {
    ATTRIBUTE_NODE,
    COMMENT_NODE,
    DOCUMENT_NODE,
    DOCUMENT_TYPE_NODE,
    DOCUMENT_FRAGMENT_NODE,
    ELEMENT_NODE,
    TEXT_NODE
} = Node

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-node}
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {*} [init]
     */
    create(init) {
        if(init && init.constructor === Object && init.hasOwnProperty('node')) {
            this.node = init.node
        }
        else super.create(init)
    }

    /**
     * @param {Boolean} deep
     * @returns {NodeAssembler|*}
     */
    cloneNode(deep) {
        return this.getInstanceOf(this.node.cloneNode(deep), this.constructor)
    }

    /**
     * @param {NodeAssembler|Node} object
     * @returns {Number}
     */
    compareDocumentPosition(object) {
        return this.node.compareDocumentPosition(this.constructor.getNodeOf(object))
    }

    /**
     * @param {Node|NodeAssembler|*|null} node
     * @param {Function} [assembler]
     * @returns {TargetAssembler|*}
     */
    getInstanceOf(node, assembler) {
        if(node) {
            const constructor = this.constructor
            const instance = constructor.getInstanceOf(node)
            if(instance) return instance
            if(!assembler) {
                assembler = constructor.resolveNodeType(node.nodeType)
            }
            return new assembler({ node })
        }
        else return null
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
        return this.node.isEqualNode(this.constructor.getNodeOf(object))
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
            if(node instanceof constructor.interface) this.setInstanceOf(node)
            else {
                const message = `Failed to set 'node' on '${ 
                    constructor.name 
                }': parameter is not of expected type.`
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
        return this.getInstanceOf(this.node.ownerDocument, this.constructor.documentAssembler)
    }

    /**
     * @abstract
     */
    static create() {
        throw Error(`Could not create an abstract ${ this.interface.name } instance`)
    }

    /**
     * @param {NodeAssembler|Node|*} object
     * @returns {*}
     */
    static getNodeOf(object) {
        return object instanceof Node? object : object.node
    }

    /**
     * @param {Number} nodeType
     * @returns {NodeAssembler|*}
     */
    static resolveNodeType(nodeType) {
        return this.nodeTypeResolver[nodeType] || NodeAssembler
    }

    /**
     * @returns {NodeAssembler.AttrAssembler|*}
     */
    static get attrAssembler() {
        return NodeAssembler.AttrAssembler
    }

    /**
     * @returns {NodeAssembler.CommentAssembler|*}
     */
    static get commentAssembler() {
        return NodeAssembler.CommentAssembler
    }

    /**
     * @returns {NodeAssembler.DocumentTypeAssembler|*}
     */
    static get doctypeAssembler() {
        return NodeAssembler.DocumentTypeAssembler
    }

    /**
     * @returns {NodeAssembler.DocumentAssembler|*}
     */
    static get documentAssembler() {
        return NodeAssembler.DocumentAssembler
    }

    /**
     * @returns {NodeAssembler.DocumentFragmentAssembler|*}
     */
    static get documentFragmentAssembler() {
        return NodeAssembler.DocumentFragmentAssembler
    }

    /**
     * @returns {NodeAssembler.ElementAssembler|*}
     */
    static get elementAssembler() {
        return NodeAssembler.ElementAssembler
    }

    /**
     * @returns {window.Node}
     */
    static get interface() {
        return Node
    }

    /**
     * @returns {{}}
     */
    static get nodeTypeResolver() {
        return {
            [ATTRIBUTE_NODE] : this.attrAssembler,
            [COMMENT_NODE] : this.commentAssembler,
            [DOCUMENT_NODE] : this.documentAssembler,
            [DOCUMENT_TYPE_NODE] : this.doctypeAssembler,
            [DOCUMENT_FRAGMENT_NODE] : this.documentFragmentAssembler,
            [ELEMENT_NODE] : this.elementAssembler,
            [TEXT_NODE] : this.textAssembler
        }
    }

    /**
     * @returns {NodeAssembler.TextAssembler|*}
     */
    static get textAssembler() {
        return NodeAssembler.TextAssembler
    }
}
