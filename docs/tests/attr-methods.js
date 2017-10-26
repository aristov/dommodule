class AttrAssembler {
    /**
     * @param {ParentNodeAssembler|*} parentNode
     */
    set parentNode(parentNode) {
        if(this.ownerElement) {
            this.ownerElement.parentNode = parentNode
        }
    }

    /**
     * @returns {ParentNodeAssembler|*}
     */
    get parentNode() {
        return this.ownerElement && this.ownerElement.parentNode
    }

    /**
     * Set child nodes of the owner element
     * @param {*} childNodes
     */
    set childNodes(childNodes) {
        if(this.ownerElement) {
            this.ownerElement.childNodes = childNodes
        }
    }

    /**
     * Get child nodes of the owner element
     * @returns {[ChildNodeAssembler]}
     */
    get childNodes() {
        return this.ownerElement? this.ownerElement.childNodes : []
    }

    /**
     * Set children of the owner element
     * @param {*} children
     */
    set children(children) {
        if(this.ownerElement) {
            this.ownerElement.childNodes = childNodes
        }
    }

    /**
     * Get children of the owner element
     * @returns {[ElementAssembler]}
     */
    get children() {
        return this.ownerElement? this.ownerElement.children : []
    }
}

class ElementAssembler {
    /**
     * @param {*} child
     */
    appendChild(child) {
        if(child instanceof AttrAssembler) {
            child.parentNode = this
        }
        else super.appendChild(child)
    }
}
