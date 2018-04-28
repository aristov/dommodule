import { Assembler } from 'esmodule'
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
const { getTargetOf } = Assembler

/**
 * @see {@link https://www.w3.org/TR/dom/#interface-node}
 * @abstract
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {*} [init]
     * @override
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
     * @param {Node|NodeAssembler|*|null} node
     * @param {Function} [assembler]
     * @returns {NodeAssembler|*}
     */
    getInstanceOf(node, assembler) {
        return this.constructor.getInstanceOf(node, assembler)
    }

    /**
     * @param {NodeAssembler|Node} object
     * @returns {Boolean}
     *
     */
    isEqualNode(object) {
        return this.node.isEqualNode(getNodeOf(object))
    }
    
    /**
     * @param {Node|*} node
     */
    set node(node) {
        if(node !== this.node) {
            const constructor = this.constructor
            if(node instanceof constructor.interface) {
                this.setInstanceOf(node)
            }
            else {
                throw TypeError(`Failed to set 'node' on '${ constructor.name }': parameter is not of expected type.`)
            }
        }
    }

    /**
     * @returns {Node|*}
     */
    get node() {
        return getTargetOf(this)
    }

    /**
     * @returns {DocumentAssembler}
     */
    get ownerDocument() {
        return this.getInstanceOf(this.node.ownerDocument, this.constructor.documentAssembler)
    }

    /**
     * @abstract
     * @override
     */
    static create() {
        throw TypeError(`Could not create an abstract ${ this.interface.name } instance`)
    }

    /**
     * @param {Node|NodeAssembler|*|null} node
     * @param {Function} [assembler]
     * @returns {NodeAssembler|*}
     */
    static getInstanceOf(node, assembler) {
        if(node) {
            const instance = super.getInstanceOf(node)
            if(instance) return instance
            if(!assembler) {
                assembler = this.resolveNodeType(node.nodeType)
            }
            return new assembler({ node })
        }
        else return null
    }

    /**
     * @param {NodeAssembler|Node|*} object
     * @returns {*}
     */
    static getNodeOf(object) {
        return object instanceof NodeAssembler? object.node : object
    }

    /**
     * @param {Number} nodeType
     * @returns {NodeAssembler|*}
     */
    static resolveNodeType(nodeType) {
        return this.nodeTypeResolver[nodeType] || this.assembler
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
     * @returns {ChildNodeAssembler|*}
     */
    static get assembler() {
        return NodeAssembler.ChildNodeAssembler
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
     * @returns {NodeAssembler.TextAssembler|*}
     */
    static get textAssembler() {
        return NodeAssembler.TextAssembler
    }

    /**
     * @returns {window.Node}
     * @override
     */
    static get interface() {
        return Node
    }
}

const { getNodeOf } = NodeAssembler
