import { NodeAssembler } from './node'

const DEFAULT_OFFSET = 0

export class RangeAssembler extends NodeAssembler {
    init(init) {
        const {
            startContainer,
            startOffset = DEFAULT_OFFSET,
            endContainer,
            endOffset = DEFAULT_OFFSET
        } = init
        if(startContainer) {
            this.node.setStart(startContainer, startOffset)
            if('startContainer' in init) delete init.startContainer
            if('startOffset' in init) delete init.startOffset
        }
        if(endContainer) {
            this.node.setEnd(endContainer, endOffset)
            if('endContainer' in init) delete init.endContainer
            if('endOffset' in init) delete init.endOffset
        }
        super.init(init)
    }

    set startContainer(startContainer) {
        this.node.setStart(startContainer, DEFAULT_OFFSET)
    }

    get startContainer() {
        return this.node.startContainer
    }

    set startOffset(startOffset) {
        const startContainer = this.startContainer
        if(startContainer) {
            this.node.setStart(startContainer, startOffset)
        }
    }

    set endContainer(endContainer) {
        this.node.setEnd(endContainer, DEFAULT_OFFSET)
    }

    get endContainer() {
        return this.node.endContainer
    }

    set endOffset(endOffset) {
        const endContainer = this.endContainer
        if(endContainer) {
            this.node.setEnd(endContainer, endOffset)
        }
    }

    set collapsed(collapsed) {
        if(collapsed) this.node.collapse()
    }

    get collapsed() {
        return this.node.collapsed
    }

    get commonAncestorContainer() {
        return this.node.commonAncestorContainer
    }

    static create() {
        return this.document.createRange()
    }
}

export function range(init) {
    return new RangeAssembler(init)
}
