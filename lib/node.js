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
const { getTargetOf } = EventTargetAssembler
const NODE_PROPERTY_NAME = 'node'

/**
 * @see https://www.w3.org/TR/dom/#interface-node
 * @abstract
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {*} [init]
     * @override
     */
    create(init) {
        if(init && init.constructor === Object && init.hasOwnProperty(NODE_PROPERTY_NAME)) {
            this.node = init.node
        }
        else super.create(init)
    }

    /**
     * @param {boolean} deep
     * @returns {NodeAssembler|*}
     */
    cloneNode(deep) {
        return this.getInstanceOf(this.node.cloneNode(deep), this.constructor)
    }

    /**
     * @param {Node|NodeAssembler|*|null} node
     * @param {class} [assembler] - NodeAssembler subclass
     * @returns {NodeAssembler|*}
     */
    getInstanceOf(node, assembler) {
        return this.constructor.getInstanceOf(node, assembler)
    }

    /**
     * @param {NodeAssembler|Node} object
     * @returns {boolean}
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
            if(node instanceof this.constructor.interface) {
                this.setInstanceOf(node)
            }
            else throw TypeError(`Failed to set 'node' on '${ this.constructor.name }': parameter is not of expected type.`)
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
        return this.getInstanceOf(this.node.ownerDocument)
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
     * @param {class} [assembler]
     * @returns {NodeAssembler|*}
     */
    static getInstanceOf(node, assembler) {
        if(node) {
            const instance = super.getInstanceOf(node)
            if(instance) {
                return instance
            }
            if(!assembler) {
                assembler = this.resolveNodeType(node)
            }
            return new assembler({ node })
        }
        return null
    }

    /**
     * @param {NodeAssembler|Node|*} object
     * @returns {*}
     */
    static getNodeOf(object) {
        return object instanceof NodeAssembler?
            object.node :
            object
    }

    /**
     * @param {Node|*} node
     * @returns {class|*}
     */
    static resolveNodeType(node) {
        const { ElementAssembler } = NodeAssembler
        const assembler = this.nodeTypeResolver[node.nodeType] || NodeAssembler.ChildNodeAssembler
        if(ElementAssembler.isPrototypeOf(assembler)) {
            const namespace = assembler.namespace || null
            return namespace === node.namespaceURI && assembler.localName === node.localName?
                assembler :
                ElementAssembler.resolveElement(node)
        }
        return assembler
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
     * @returns {class|*} AttrAssembler
     */
    static get attrAssembler() {
        return NodeAssembler.AttrAssembler
    }

    /**
     * @returns {class|*} CommentAssembler or ChildNodeAssembler
     */
    static get commentAssembler() {
        return NodeAssembler.CommentAssembler || NodeAssembler.ChildNodeAssembler
    }

    /**
     * @returns {class|*} DocumentTypeAssembler or ChildNodeAssembler
     */
    static get doctypeAssembler() {
        return NodeAssembler.DocumentTypeAssembler || NodeAssembler.ChildNodeAssembler
    }

    /**
     * @returns {class|*} DocumentAssembler or ParentNodeAssembler
     */
    static get documentAssembler() {
        return NodeAssembler.DocumentAssembler || NodeAssembler.ParentNodeAssembler
    }

    /**
     * @returns {class|*} DocumentFragmentAssembler or ParentNodeAssembler
     */
    static get documentFragmentAssembler() {
        return NodeAssembler.DocumentFragmentAssembler || NodeAssembler.ParentNodeAssembler
    }

    /**
     * @returns {class|*} ElementAssembler
     */
    static get elementAssembler() {
        return NodeAssembler.ElementAssembler
    }

    /**
     * @returns {class|*} TextAssembler or ChildNodeAssembler
     */
    static get textAssembler() {
        return NodeAssembler.TextAssembler || NodeAssembler.ChildNodeAssembler
    }

    /**
     * @returns {interface} Node
     * @override
     */
    static get interface() {
        return Node
    }
}

const { getNodeOf } = NodeAssembler
