import {
    TYPE_STRING,
    TYPE_FUNCTION,
    DEFAULT_PREFIX,
    DEFAULT_NAMESPACE_URI,
    NAMESPACE_SEPARATOR,
    NO_PARENT_INDEX
} from './const'
import { Attr, Document, Element, document } from './dom'
import { AttrAssembler } from './attr'
import { DocumentAssembler } from './document'
import { ParentNodeAssembler } from './parentnode'

const { keys } = Object
const { isArray, prototype : { indexOf, map, reduce } } = Array

function attrset(attrset, { name, value }) {
    attrset[name] = value
    return attrset
}

/**
 * Element DOM node assembler
 */
export class ElementAssembler extends ParentNodeAssembler {
    /**
     * this.setAttribute(AttrAssembler, 'foobar')
     * this.setAttribute('attr', 'foobar')
     *
     * @param {Function|String} attr
     * @param {String} value
     */
    setAttribute(attr, value) {
        const type = typeof attr
        const isFunctionType = type === TYPE_FUNCTION
        if((isFunctionType || type === TYPE_STRING) && typeof value === TYPE_STRING) {
            const instance = this.getAttributeNode(attr)
            if(instance) instance.value = value
            else if(isFunctionType) {
                this.setAttributeNode(new attr({ value }))
            }
            else {
                const assembler = this.constructor.attrAssembler
                const instance = new assembler({ localName : attr, value })
                this.setAttributeNode(instance)
            }
        }
        else {
            throw TypeError(`Failed to execute 'setAttribute' on '${
                this.constructor.name
                }': parameters are not of expected types.`)
        }
    }

    /**
     * this.getAttribute(AttrAssembler)
     * this.getAttribute('attr')
     *
     * @param {Function|String} attr
     * @returns {String}
     */
    getAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespaceURI, qualifiedName, localName } = attr
            return namespaceURI?
                node.getAttributeNS(namespaceURI, localName) :
                node.getAttribute(qualifiedName)
        }
        else if(typeof attr === TYPE_STRING) {
            return node.getAttribute(attr)
        }
        else {
            throw TypeError(`Failed to execute 'getAttribute' on '${
                this.constructor.name
                }': parameter is not of expected type.`)
        }
    }

    /**
     * @param {Function|String} attr
     * @returns {Boolean}
     */
    hasAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespaceURI, qualifiedName, localName } = attr
            return namespaceURI?
                node.hasAttributeNS(namespaceURI, localName) :
                node.hasAttribute(qualifiedName)
        }
        else if(typeof attr === TYPE_STRING) {
            return node.hasAttribute(attr)
        }
        else {
            throw TypeError(`Failed to execute 'hasAttribute' on '${
                this.constructor.name
                }': parameter is not of expected type.`)
        }
    }

    /**
     * @param {Function|String} attr
     */
    removeAttribute(attr) {
        const node = this.node
        if(typeof attr === TYPE_FUNCTION) {
            const { namespaceURI, qualifiedName, localName } = attr
            if(namespaceURI) node.removeAttributeNS(namespaceURI, localName)
            else node.removeAttribute(qualifiedName)
        }
        else if(typeof attr === TYPE_STRING) {
            node.removeAttribute(attr)
        }
        else {
            throw TypeError(`Failed to execute 'removeAttribute' on '${
                this.constructor.name
                }': parameter is not of expected type.`)
        }
    }

    /**
     * this.setAttributeNode(new AttrAssembler)
     * this.setAttributeNode(document.createAttribute('attr'))
     *
     * @param {AttrAssembler|Attr} attr
     * @returns {AttrAssembler|ElementAssembler.attrAssembler|null}
     */
    setAttributeNode(attr) {
        const node = this.node
        let replacedNode
        if(attr instanceof AttrAssembler) {
            const { namespaceURI, name } = attr.node
            replacedNode = namespaceURI?
                node.getAttributeNodeNS(namespaceURI, name) :
                node.getAttributeNode(name)
            attr.ownerElement = node
        }
        else {
            replacedNode = attr.namespaceURI?
                node.setAttributeNodeNS(attr) :
                node.setAttributeNode(attr)
        }
        if(replacedNode) {
            const instance = this.getInstance(replacedNode)
            if(instance) return instance
            else {
                const { attrAssembler } = this.constructor
                return new attrAssembler({ node : replacedNode })
            }
        }
        else return null
    }

    /**
     * this.getAttributeNode(AttrAssembler)
     * this.getAttributeNode('attr')
     *
     * @param {Function|String} attr
     * @returns {AttrAssembler|null}
     */
    getAttributeNode(attr) {
        const node = this.node
        const isFunctionType = typeof attr === TYPE_FUNCTION
        let attrNode
        if(isFunctionType) {
            const { namespaceURI, qualifiedName, localName } = attr
            attrNode = namespaceURI?
                node.getAttributeNodeNS(namespaceURI, localName) :
                node.getAttributeNode(qualifiedName)
        }
        else attrNode = node.getAttributeNode(attr)
        if(attrNode) {
            const instance = this.getInstance(attrNode)
            if(instance) return instance
            else {
                const assembler = isFunctionType?
                    attr :
                    this.constructor.attrAssembler
                return new assembler({ node : attrNode })
            }
        }
        else return null
    }

    /**
     * this.removeAttributeNode(this.getAttributeNode('attr'))
     * this.removeAttributeNode(this.node.getAttributeNode('attr'))
     * this.removeAttributeNode(AttrAssembler)
     * this.removeAttributeNode('attr')
     *
     * @param {AttrAssembler|Attr|Function|String} attr
     * @returns {AttrAssembler|null}
     */
    removeAttributeNode(attr) {
        const node = this.node
        const isFunctionType = typeof attr === TYPE_FUNCTION
        let attrNode
        if(attr instanceof AttrAssembler) {
            attrNode = node.removeAttributeNode(attr.node)
        }
        else if(attr instanceof Attr) {
            attrNode = node.removeAttributeNode(attr)
        }
        else if(isFunctionType || typeof attr === TYPE_STRING) {
            const instance = this.getAttributeNode(attr)
            attrNode = instance && instance.node
            if(attrNode) node.removeAttributeNode(attrNode)
        }
        else {
            throw TypeError(`Failed to execute 'removeAttributeNode' on '${
                this.constructor.name
                }': parameter is not of expected type.`)
        }
        if(attrNode) {
            const instance = this.getInstance(attrNode)
            const assembler = isFunctionType? attr : this.constructor.attrAssembler
            return instance || new assembler({ node : attrNode })
        }
        else return null
    }

    /**
     * Set the unique identifier on the element
     * @param {String} id
     */
    set id(id) {
        this.node.id = id
    }

    /**
     * Get the unique identifier of the element
     * @returns {String}
     */
    get id() {
        return this.node.id
    }

    /**
     * Set the class name of the element
     * @param {String} className
     */
    set className(className) {
        this.node.className = className
    }

    /**
     * Get the class name of the element
     * @returns {String}
     */
    get className() {
        return this.node.className
    }

    /**
     * Set the class list of the element
     * @param {*} classList token / token list / token-boolean dict {String|Array|{}}
     */
    set classList(classList) {
        if(classList) {
            const list = this.node.classList
            if(isArray(classList)) {
                classList.forEach(token => this.classList = token)
            }
            else if(classList.constructor === Object) {
                keys(classList).forEach(token => {
                    if(classList[token]) list.add(token)
                })
            }
            else list.add(classList)
        }
    }

    /**
     * Get the class list of the element as an array
     * @returns {DOMTokenList} classList interface
     */
    get classList() {
        return this.node.classList
    }

    /**
     * Set content attributes on the element
     * @param {*} attrset dictionary object
     */
    set attrset(attrset) {
        const node = this.node
        for(let name in attrset) {
            node.setAttribute(name, attrset[name])
        }
    }

    /**
     * Get all content attributes of the element as a dictionary-object
     * @returns {{}}
     */
    get attrset() {
        return reduce.call(this.node.attributes, attrset, {})
    }

    /**
     * Set content attributes on the element
     * @param {*} attributes
     */
    set attributes(attributes) {
        if(attributes instanceof AttrAssembler) {
            attributes.ownerElement = this.node
        }
        else if(isArray(attributes)) {
            attributes.forEach(attr => this.attributes = attr)
        }
        else this.setAttributeNode(attributes)
    }

    /**
     * Get all attributes of the element as an array
     * @returns {Array}
     */
    get attributes() {
        const assembler = this.constructor.attrAssembler
        return map.call(this.node.attributes, node => {
            return this.getInstance(node) || new assembler({ node })
        })
    }

    /**
     * Append children to the element
     * @param {*} children
     */
    set children(children) {
        this.append(children)
    }

    /**
     * Get all children of the element as an array
     * @returns {Array}
     */
    get children() {
        return map.call(this.node.children, node => {
            const instance = this.getInstance(node)
            if(instance) return instance
            else {
                const { elementAssembler } = this.constructor
                return new elementAssembler({ node })
            }
        })
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get firstElementChild() {
        return this.getInstance(this.node.firstElementChild)
    }

    /**
     * @returns {ChildNodeAssembler|*}
     */
    get lastElementChild() {
        return this.getInstance(this.node.lastElementChild)
    }

    /**
     * @param {ParentNodeAssembler|*} parentNode
     */
    set parentNode(parentNode) {
        if(parentNode instanceof DocumentAssembler) {
            parentNode.documentElement = this.node
        }
        else {
            if(parentNode instanceof Document) {
                const element = parentNode.documentElement
                if(element) parentNode.removeChild(element)
            }
            super.parentNode = parentNode
        }
    }

    /**
     * @returns {ParentNodeAssembler|*}
     */
    get parentNode() {
        return super.parentNode
    }

    /**
     * Get a next sibling of the element
     * @returns {ChildNodeAssembler|null|*}
     */
    get nextElementSibling() {
        return this.getInstance(this.node.nextElementSibling)
    }

    /**
     * Get a previous sibling of the element
     * @returns {ChildNodeAssembler|null|*}
     */
    get previousElementSibling() {
        return this.getInstance(this.node.previousElementSibling)
    }

    /**
     * Get the element index among its sibling elements or -1 if it has no parent
     * @returns {Number}
     */
    get elementIndex() {
        const parentNode = this.node.parentNode
        return parentNode?
            indexOf.call(parentNode.children, this.node) :
            NO_PARENT_INDEX
    }

    /**
     * Create the specified Element node
     * @param {*} [init]
     * @returns {Element|*} created element
     */
    static create(init) {
        const {
            namespaceURI = this.namespaceURI,
            prefix = this.prefix,
            localName = this.localName
        } = init || this
        let qualifiedName = init && init.qualifiedName
        if(!qualifiedName) {
            qualifiedName = prefix?
                prefix + NAMESPACE_SEPARATOR + localName :
                localName
        }
        return document.createElementNS(namespaceURI, qualifiedName)
    }

    /**
     * Default namespace URI
     * @returns {String}
     */
    static get namespaceURI() {
        return DEFAULT_NAMESPACE_URI
    }

    /**
     * The XML namespace prefix
     * @returns {String}
     */
    static get prefix() {
        return DEFAULT_PREFIX
    }

    /**
     * The local name of the element node
     * @returns {String}
     */
    static get localName() {
        return this === ElementAssembler? element.name : this.name.toLowerCase()
    }

    /**
     * The qualified name of the element node
     * @returns {String}
     */
    static get qualifiedName() {
        const { prefix, localName } = this
        return prefix?
            prefix + NAMESPACE_SEPARATOR + localName :
            localName
    }

    /**
     * @returns {Function}
     */
    static get attrAssembler() {
        return AttrAssembler
    }

    /**
     * @returns {Function}
     */
    static get elementAssembler() {
        return ElementAssembler
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return Element
    }
}

/**
 * Element assembler factory
 * @param {*} init
 * @returns {ElementAssembler}
 */
export function element(...init) {
    return new ElementAssembler(...init)
}
