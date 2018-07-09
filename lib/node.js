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
    clone(deep) {
        return this.constructor.getInstanceOf(this.node.cloneNode(deep))
    }

    /**
     * @param {Node|NodeAssembler|*|null} node
     * @returns {NodeAssembler|*|null}
     */
    getInstanceOf(node) {
        return node?
            this.constructor.getAssemblerOf(node).getInstanceOf(node) :
            null
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
            case ATTRIBUTE_NODE:
                return this.attrAssembler.resolve(node)
            case COMMENT_NODE:
                return this.commentAssembler.resolve(node)
            case DOCUMENT_NODE:
                return this.documentAssembler.resolve(node)
            case DOCUMENT_TYPE_NODE:
                return this.doctypeAssembler.resolve(node)
            case DOCUMENT_FRAGMENT_NODE:
                return this.documentFragmentAssembler.resolve(node)
            case ELEMENT_NODE:
                return this.elementAssembler.resolve(node)
            case TEXT_NODE:
                return this.textAssembler.resolve(node)
            default:
                return NodeAssembler.CharacterDataAssembler
                    || NodeAssembler.ChildNodeAssembler
                    || NodeAssembler
        }
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
     * @returns {class|*} AttrAssembler or fallback
     */
    static get attrAssembler() {
        return NodeAssembler.AttrAssembler || NodeAssembler
    }

    /**
     * @returns {class|*} CommentAssembler or fallback
     */
    static get commentAssembler() {
        return NodeAssembler.CommentAssembler
            || NodeAssembler.CharacterDataAssembler
            || NodeAssembler.ChildNodeAssembler
            || NodeAssembler
    }

    /**
     * @returns {class|*} DocumentTypeAssembler or fallback
     */
    static get doctypeAssembler() {
        return NodeAssembler.DocumentTypeAssembler
            || NodeAssembler.ChildNodeAssembler
            || NodeAssembler
    }

    /**
     * @returns {class|*} DocumentAssembler or fallback
     */
    static get documentAssembler() {
        return NodeAssembler.DocumentAssembler
            || NodeAssembler.ParentNodeAssembler
            || NodeAssembler
    }

    /**
     * @returns {class|*} DocumentFragmentAssembler or fallback
     */
    static get documentFragmentAssembler() {
        return NodeAssembler.DocumentFragmentAssembler
            || NodeAssembler.ParentNodeAssembler
            || NodeAssembler.ChildNodeAssembler
            || NodeAssembler
    }

    /**
     * @returns {class|*} ElementAssembler or fallback
     */
    static get elementAssembler() {
        return NodeAssembler.ElementAssembler
            || NodeAssembler.ParentNodeAssembler
            || NodeAssembler.ChildNodeAssembler
            || NodeAssembler
    }

    /**
     * @returns {class|*} TextAssembler or fallback
     */
    static get textAssembler() {
        return NodeAssembler.TextAssembler
            || NodeAssembler.CharacterDataAssembler
            || NodeAssembler.ChildNodeAssembler
            || NodeAssembler
    }

    /**
     * @returns {string}
     * @override
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
