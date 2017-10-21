import { TYPE_STRING, implementation } from './core'
import { ChildNodeAssembler } from './childnode'
import { DocumentAssembler } from './document'

const DEFAULT_PUBLIC_ID = ''
const DEFAULT_SYSTEM_ID = ''

/**
 * DocumentType DOM node assembler
 */
export class DocumentTypeAssembler extends ChildNodeAssembler {
    /**
     * @param {DocumentAssembler} parentNode
     */
    set parentNode(parentNode) {
        parentNode.node.prepend(this.node)
    }

    /**
     * @returns {DocumentAssembler}
     */
    get parentNode() {
        return this.getInstance(this.node.parentNode)
    }

    /**
     * Create the specified DocumentType node
     * @param {*} init
     * @returns {DocumentType}
     */
    static create(init) {
        if(typeof init === TYPE_STRING) {
            return implementation.createDocumentType(init, this.publicId, this.systemId)
        }
        else {
            const {
                qualifiedName = this.qualifiedName,
                publicId = this.publicId,
                systemId = this.systemId
            } = init || this
            return implementation.createDocumentType(qualifiedName, publicId, systemId)
        }
    }

    /**
     * @returns {String}
     */
    static get qualifiedName() {
        return DocumentTypeAssembler?
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
}

/**
 * DocumentType assembler factory
 * @param {Node|{}|String} [init]
 * @returns {DocumentTypeAssembler}
 */
export function doctype(...init) {
    return new DocumentTypeAssembler(...init)
}
