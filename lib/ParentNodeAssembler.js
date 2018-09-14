import { AttrAssembler } from './AttrAssembler'
import { ChildNodeAssembler } from './ChildNodeAssembler'
import { NodeAssembler } from './NodeAssembler'

const { prototype : { map } } = Array
const { MutationObserver, Node } = window
const { ATTRIBUTE_NODE, DOCUMENT_FRAGMENT_NODE } = Node
const { getNodeOf } = NodeAssembler
const { flatten } = ChildNodeAssembler
const CHILDREN_PROPERTY_NAME = 'children'
const TYPE_FUNCTION = 'function'
const TYPE_STRING = 'string'
const key = Symbol()

/**
 * @param {{context,attributeOldValue,subtree}|ParentNodeAssembler|*} [options]
 * @param {ParentNodeAssembler|*} [options.context]
 * @param {boolean} [options.attributeOldValue]
 * @param {boolean} [options.subtree]
 * @returns {{context,attributeOldValue,subtree}}
 */
function getOptions(options) {
    const result = {}
    if(options) {
        if(options instanceof NodeAssembler) {
            result.context = options
        }
        else {
            result.context = options.context
            result.attributeOldValue = options.attributeOldValue || false
            result.subtree = options.subtree || false
        }
    }
    return result
}

/**
 * @see https://www.w3.org/TR/dom/#interface-parentnode
 * @abstract
 */
export class ParentNodeAssembler extends ChildNodeAssembler {
    /**
     * Append child nodes to the node
     * @param {string|Node|ChildNodeAssembler|array|*} childNodes
     */
    append(...childNodes) {
        const node = this.node
        flatten(childNodes).forEach(child => {
            if(child instanceof ChildNodeAssembler || child instanceof AttrAssembler) {
                const parentNode = child.node.parentNode
                if(parentNode && parentNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
                    node.append(parentNode)
                }
                else child.parentNode = node
            }
            else node.append(child)
        })
    }

    /**
     * @param {ChildNodeAssembler|Node|*} object
     * @returns {boolean}
     */
    contains(object) {
        return this.node.contains(getNodeOf(object))
    }

    /**
     * @param {class|string|*} subject - ElementAssembler or AttrAssembler subclass or selector
     * @param {function} [subject.getAttrOf]
     * @param {function} [subject.getInstanceOf]
     * @param {function|string} [filter]
     * @returns {ElementAssembler|AttrAssembler|*|null}
     */
    find(subject, filter) {
        const isString = typeof subject === TYPE_STRING
        if(typeof filter === TYPE_FUNCTION) {
            const instances = this.findAll(subject, filter)
            return instances[0] || null
        }
        let selector = isString?
            subject :
            subject.selector
        if(typeof filter === TYPE_STRING) {
            selector += filter
        }
        const node = this.node.querySelector(selector)
        if(node) {
            if(AttrAssembler.isPrototypeOf(subject)) {
                return subject.getAttrOf(node)
            }
            else {
                const assembler = isString?
                    this.constructor.getAssemblerOf(node) :
                    subject
                return assembler.getInstanceOf(node)
            }
        }
        return null
    }

    /**
     * @param {class|string|*} subject - ElementAssembler or AttrAssembler subclass or selector
     * @param {function} [subject.getAttrOf]
     * @param {function} [subject.getInstanceOf]
     * @param {function|string} [filter]
     * @returns {array.ElementAssembler|array.AttrAssembler|*}
     */
    findAll(subject, filter) {
        const isString = typeof subject === TYPE_STRING
        let selector = isString?
            subject :
            subject.selector
        if(typeof filter === TYPE_STRING) {
            selector += filter
        }
        const nodeList = this.node.querySelectorAll(selector)
        const isAttr = AttrAssembler.isPrototypeOf(subject)
        const results = map.call(nodeList, node => {
            if(isAttr) {
                return subject.getAttrOf(node)
            }
            else {
                const assembler = isString?
                    this.constructor.getAssemblerOf(node) :
                    subject
                return assembler.getInstanceOf(node)
            }
        })
        return typeof filter === TYPE_FUNCTION?
            results.filter(filter) :
            results
    }

    /**
     * Prepend child nodes to the node
     * @param {string|Node|ChildNodeAssembler|array|*} childNodes
     */
    prepend(...childNodes) {
        this.node.prepend(...flatten(childNodes).map(child => {
            const node = getNodeOf(child) || child
            return node.nodeType === ATTRIBUTE_NODE?
                node.ownerElement :
                node
        }))
    }

    /**
     * @param {class|string} type
     * @param {function} callback
     * @param {{attributeOldValue,subtree}|{}|boolean|EventTargetAssembler|*} [options]
     */
    on(type, callback, options) {
        if(AttrAssembler.isPrototypeOf(type)) {
            const { context = this, subtree } = options = getOptions(options)
            const name = type.localName
            const storage = context[key] || (context[key] = { true : {}, false : {} })
            const handlers = storage[Boolean(subtree)]
            const map = handlers[name] || (handlers[name] = new Map)
            if(!map.has(callback)) {
                const observer = new MutationObserver(records => {
                    records.forEach(record => callback.call(context, record))
                })
                map.set(callback, observer)
                options.attributeFilter = [name]
                delete options.context
                observer.observe(this.node, options)
            }
        }
        else super.on(type, callback, options)
    }

    /**
     * @param {class|string} type
     * @param {function} callback
     * @param {{}|boolean|EventTargetAssembler|*} [options]
     */
    un(type, callback, options) {
        if(AttrAssembler.isPrototypeOf(type)) {
            const { context = this, subtree } = getOptions(options)
            const storage = context[key]
            const map = storage && storage[Boolean(subtree)][type.localName]
            const observer = map && map.get(callback)
            if(observer) {
                observer.takeRecords().forEach(record => callback.call(context, record))
                observer.disconnect()
                map.delete(callback)
            }
        }
        else super.un(type, callback, options)
    }

    /**
     * Get an array of child nodes
     * @returns {*} {array}
     */
    get childNodes() {
        return map.call(this.node.childNodes, node => this.getInstanceOf(node))
    }

    /**
     * Append children to the element
     * @param {*} children
     */
    set children(children) {
        if(this.node.hasChildNodes()) {
            Array.from(this.node.childNodes).forEach(child => child.remove())
        }
        this.append(children)
    }

    /**
     * Get all children of the element as an array
     * @returns {ElementAssembler[]}
     */
    get children() {
        return map.call(this.node.children, node => this.getInstanceOf(node))
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} firstChild
     */
    set firstChild(firstChild) {
        this.prepend(firstChild)
    }

    /**
     * @returns {ChildNodeAssembler|*|null}
     */
    get firstChild() {
        return this.getInstanceOf(this.node.firstChild)
    }

    /**
     * @returns {ElementAssembler|*|null}
     */
    get firstElementChild() {
        return this.getInstanceOf(this.node.firstElementChild)
    }

    /**
     * @param {ChildNodeAssembler|ChildNode|*} lastChild
     */
    set lastChild(lastChild) {
        this.append(lastChild)
    }

    /**
     * @returns {ChildNodeAssembler|*|null}
     */
    get lastChild() {
        return this.getInstanceOf(this.node.lastChild)
    }

    /**
     * @returns {ChildNodeAssembler|*|null}
     */
    get lastElementChild() {
        return this.getInstanceOf(this.node.lastElementChild)
    }

    /**
     * Set a text content of the node
     * @param {string} textContent
     */
    set textContent(textContent) {
        this.node.textContent = textContent
    }

    /**
     * Get a text content of the node
     * @returns {string}
     */
    get textContent() {
        return this.node.textContent
    }

    /**
     * @returns {string}
     * @override
     */
    static get defaultPropertyName() {
        return CHILDREN_PROPERTY_NAME
    }
}

NodeAssembler.ParentNodeAssembler = ParentNodeAssembler
