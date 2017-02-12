export class EventTargetAssembler {
    constructor(init) {
        if(init) this.assemble(init)
    }
    assemble(init) {
        this.instantiate(init)
        return this.init(init)
    }
    instantiate(init) {
        if('target' in init) {
            this.target = init.target
            delete init.target
        }
        return this.target
    }
    init(init) {
        const target = this.target
        for(let prop in init) {
            const value = init[prop]
            if(value !== undefined) {
                if(prop in this) this[prop] = value
                else if(prop in target) target[prop] = value
                else this.onmismatch(prop, value)
            }
        }
        return target
    }
}

Object.defineProperty(EventTargetAssembler.prototype, 'target', { writable : true, value : null })

/*================================================================*/

export class NodeAssembler extends EventTargetAssembler {
    instantiate(init) {
        if('node' in init) {
            this.node = init.node
            delete init.node
            return this.node
        }
        else return super.instantiate(init)
    }
    set node(node) {
        this.target = node
    }
    get node() {
        return this.target
    }
    set childNodes(childNodes) {
        if(Array.isArray(childNodes)) {
            const handler = child => this.childNodes = child
            childNodes.forEach(handler)
        }
        else if(childNodes) {
            if(childNodes instanceof NodeAssembler) {
                childNodes.parentNode = this.node
            }
            else this.node.append(childNodes)
        }
    }
    get childNodes() {
        return Array.from(this.node.childNodes)
    }
    set parentNode(parentNode) {
        parentNode.appendChild(this.node)
    }
    get parentNode() {
        return this.node.parentNode
    }
    get ownerDocument() {
        return this.node.ownerDocument
    }
}

/*================================================================*/

const DEFAULT_NAMESPACE_PREFIX = ''
const DEFAULT_NAMESPACE_URI = ''
const XML_NAMESPACE_SEPARATOR = ':'
const FIRST_LETTER_RE = /^(\w)/

function toLowerCase(str) {
    return str.toLowerCase()
}

export class ElementAssembler extends NodeAssembler {
    assemble(init) {
        if(init && init.constructor !== Object) {
            this.instantiate()
            this.childNodes = init
            return this.node
        }
        else return super.assemble(init)
    }
    instantiate(init) {
        if(init && 'node' in init) return super.instantiate(init)
        else return this.node = this.constructor.create(init)
    }
    set node(node) {
        super.node = node
    }
    get node() {
        return super.node || this.instantiate()
    }
    static create(init) {
        const {
            namespaceURI = this.namespaceURI,
            qualifiedName = this.qualifiedName
        } = init || this
        if(init) {
            if('namespaceURI' in init) delete init.namespaceURI
            if('qualifiedName' in init) delete init.qualifiedName
        }
        return this.document.createElementNS(namespaceURI, qualifiedName)
    }
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }
    static get prefix() {
        return DEFAULT_NAMESPACE_PREFIX
    }
    static get localName() {
        return this.name.replace(FIRST_LETTER_RE, toLowerCase)
    }
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + XML_NAMESPACE_SEPARATOR + localName :
            localName
    }
    static get document() {
        return window.document
    }
}

export function element(init) {
    return new ElementAssembler(init)
}
