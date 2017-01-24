/**
 * EventTarget
 */
export class EventTargetAssembler {}

/**
 * Node
 *  parentNode
 *  [parentElement]
 *  childNodes
 *  firstChild
 *  lastChild
 *  previousSibling
 *  nextSibling
 *  [nodeValue]
 *  textContent
 */
export class NodeAssembler extends EventTargetAssembler {
    set parentNode(parentNode) {
        parentNode.appendChild(this.node)
    }
    get parentNode() {
        return this.node.parentNode
    }
    set childNodes(childNodes) {
        this.node.append(...childNodes)
    }
    get childNodes() {
        return Array.from(this.node.childNodes)
    }
    set firstChild(firstChild) {
        const node = this.node
        const child = this.firstChild
        if(child) node.replaceChild(firstChild, child)
        else node.appendChild(firstChild)
    }
    get firstChild() {
        return this.node.firstChild
    }
    set lastChild(lastChild) {
        const node = this.node
        const child = this.lastChild
        if(child) node.replaceChild(lastChild, child)
        else node.appendChild(lastChild)

    }
    get lastChild() {
        return this.node.lastChild
    }
    set previousSibling(previousSibling) {
        const node = this.node
        const sibling = this.previousSibling
        const parent = node.parentNode
        if(parent) {
            if(sibling) parent.replaceChild(previousSibling, sibling)
            else parent.insertBefore(node, previousSibling)
        }
        else throw Error('set previousSibling: node must have a parent!')
    }
    get previousSibling() {
        return this.node.previousSibling
    }
    set nextSibling(nextSibling) {
        const node = this.node
        const sibling = this.nextSibling
        const parent = node.parentNode
        if(parent) {
            if(sibling) parent.replaceChild(nextSibling, sibling)
            else parent.insertBefore(node, nextSibling)
        }
        else throw Error('set nextSibling: node must have a parent!')
    }
    get nextSibling() {
        return this.node.nextSibling
    }
    set textContent(textContent) {
        this.node.textContent = textContent
    }
    get textContent() {
        return this.node.textContent
    }
}
