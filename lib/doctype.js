import { TYPE_STRING } from './const'
import { DocumentType, implementation } from './dom'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'

const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''

/**
 * DocumentType DOM node assembler
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     * @param {DocumentAssembler|null} parentNode
     */
    set parentNode(parentNode) {
        const node = parentNode.node
        const firstChild = node.firstChild
        if(firstChild) {
            node.insertBefore(this.node, firstChild)
        }
        else node.appendChild(this.node)
    }

    /**
     * @returns {DocumentAssembler|null}
     */
    get parentNode() {
        return super.parentNode
    }

    /**
     * @param {*} init
     * @returns {init}
     */
    create(init) {
        return typeof init === TYPE_STRING?
            super.create({ qualifiedName : init }) :
            super.create(init)
    }

    /**
     * Create the specified DocumentType node
     * @param {String} qualifiedName
     * @param {String} publicId
     * @param {String} systemId
     * @returns {DocumentType}
     */
    static create({
        qualifiedName = this.qualifiedName,
        publicId = this.publicId,
        systemId = this.systemId
    } = this) {
        return implementation.createDocumentType(qualifiedName, publicId, systemId)
    }

    /**
     * @returns {String}
     */
    static get qualifiedName() {
        return this === DocumentTypeAssembler?
            DocumentAssembler.qualifiedName :
            this.name.toLowerCase()
    }

    /**
     * @returns {String}
     */
    static get publicId() {
        return DEFAULT_PUBLIC_ID
    }

    /**
     * @returns {String}
     */
    static get systemId() {
        return DEFAULT_SYSTEM_ID
    }

    /**
     * @returns {Function}
     */
    static get domInterface() {
        return DocumentType
    }
}

/**
 * DocumentType assembler factory
 * @param {Node|{}|String} [init]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(...init) {
    return new DocumentTypeAssembler(...init)
}
