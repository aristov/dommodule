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

export function text(data) {
    const assembler = new TextAssembler
    assembler.create(data)
    return assembler
}

export class CDATASectionAssembler extends TextAssembler {
    create(data) {
        return this.node = document.createCDATASection(data)
    }
}

export function cdata(data) {
    const assembler = new CDATASectionAssembler
    assembler.create(data)
    return assembler
}

export class CommentAssembler extends CharacterDataAssembler {
    create(data) {
        return this.node = document.createComment(data)
    }
}

export function comment(data) {
    const assembler = new CommentAssembler
    assembler.create(data)
    return assembler
}

export class ProcessingInstructionAssembler extends CharacterDataAssembler {
    create(target, data) {
        return this.node = document.createProcessingInstruction(target, data)
    }
}

export function instruction(target, data) {
    const assembler = new ProcessingInstructionAssembler
    assembler.create(target, data)
    return assembler
}
