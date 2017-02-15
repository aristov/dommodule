import { NodeAssembler } from './node'
import {
    DEFAULT_NAMESPACE_URI,
    DEFAULT_NAMESPACE_PREFIX
} from './defaults'

const DEFAULT_ATTR_LOCAL_NAME = 'attr'
const DEFAULT_ATTR_QUALIFIED_NAME = 'attribute'

export class AttrAssembler extends NodeAssembler {
    /**
     *
     * @param {String} value
     */
    set value(value) {
        this.node.value = value
    }

    /**
     * @returns {String}
     */
    get value() {
        return this.node.value
    }

    /**
     *
     * @param {String} namespaceURI
     * @param {String} qualifiedName
     * @param {String} localName
     */
    static create({
        namespaceURI = this.namespaceURI,
        qualifiedName = this.qualifiedName,
        localName = this.localName,
    } = this) {
        if(namespaceURI) {
            this.document.createAttributeNS(namespaceURI, qualifiedName)
        }
        else this.document.createAttribute(localName)
    }

    /**
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * @returns {String}
     */
    static get prefix() {
        return DEFAULT_NAMESPACE_PREFIX
    }

    /**
     * @returns {String}
     */
    static get localName() {
        return this === AttrAssembler?
            DEFAULT_ATTR_LOCAL_NAME :
            this.name
    }

    /**
     * @returns {String}
     */
    static get qualifiedName() {
        return this === AttrAssembler?
            DEFAULT_ATTR_QUALIFIED_NAME :
            this.name
    }
}

/**
 * 
 * @param {*} init
 * @returns {AttrAssembler}
 */
export function attr(init) {
    return new AttrAssembler(init)
}
