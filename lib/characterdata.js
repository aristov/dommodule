import { NodeAssembler } from './node'

export class CharacterDataAssembler extends NodeAssembler {
    set data(data) {
        this.node.data = data
    }

    get data() {
        return this.node.data
    }
}

export class TextAssembler extends CharacterDataAssembler {
    create(data) {
        return this.node = document.createTextNode(data)
    }

    set wholeText(wholeText) {
        let sibling = this.node
        while(sibling = sibling.previousSibling) {
            if(sibling instanceof Text) sibling.remove()
            else break
        }
        while(sibling = sibling.nextSibling) {
            if(sibling instanceof Text) sibling.remove()
            else break
        }
        this.data = wholeText
    }

    get wholeText() {
        return this.node.wholeText
    }
}

export class CDATASectionAssembler extends TextAssembler {
    create(data) {
        return this.node = document.createCDATASection(data)
    }
}

export class CommentAssembler extends CharacterDataAssembler {
    create(data) {
        return this.node = document.createComment(data)
    }
}

export class ProcessingInstructionAssembler extends CharacterDataAssembler {
    create({ target, data }) {
        return this.node = document.createProcessingInstruction(target, data)
    }
}

export function text(object, init) {
    return new TextAssembler(object, init)
}

export function cdata(object, init) {
    return new CDATASectionAssembler(object, init)
}

export function comment(object, init) {
    return new CommentAssembler(object, init)
}

export function instruction(object, init) {
    return new ProcessingInstructionAssembler(object, init)
}
