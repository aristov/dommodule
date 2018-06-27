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
     * @param {boolean} [deep]
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
     * @param {Node|*} node
     * @returns {class|*}
     */
    static getAssemblerOf(node) {
        switch(node.nodeType) {
            case ATTRIBUTE_NODE :
                return this.attrAssembler.resolve(node)
            case COMMENT_NODE :
                return this.commentAssembler.resolve(node)
            case DOCUMENT_NODE :
                return this.documentAssembler.resolve(node)
            case DOCUMENT_TYPE_NODE :
                return this.doctypeAssembler.resolve(node)
            case DOCUMENT_FRAGMENT_NODE :
                return this.documentFragmentAssembler.resolve(node)
            case ELEMENT_NODE :
                return this.elementAssembler.resolve(node)
            case TEXT_NODE :
                return this.textAssembler.resolve(node)
            default :
                return NodeAssembler.ChildNodeAssembler
        }
    }

    /**
     * @param {Node|NodeAssembler|*|null} node
     * @param {class} [assembler]
     * @returns {NodeAssembler|*|null}
     */
    static getInstanceOf(node, assembler) {
        if(node) {
            const instance = super.getInstanceOf(node)
            if(instance) {
                return instance
            }
            if(!assembler) {
                assembler = this.getAssemblerOf(node)
            }
            return new assembler({ node })
        }
        return null
    }

    /**
     * @param {NodeAssembler|Node|*} object
     * @returns {Node|*|null}
     */
    static getNodeOf(object) {
        const result = getTargetOf(object)
        return result instanceof Node || result instanceof window.Attr? // https://github.com/jsdom/jsdom/issues/1641
            result :
            null
    }

    /**
     * @param {Node|*} node
     * @returns {NodeAssembler|*}
     * @abstract
     */
    static resolve(node) {
        return this
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
     * @returns {string}
     */
    static get targetPropertyName() {
        return NODE_PROPERTY_NAME
    }

    /**
     * @returns {interface} Node
     * @override
     */
    static get interface() {
        return Node
    }
}
