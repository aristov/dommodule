import chai from 'chai'
import {
    ProcessingInstruction,
    ProcessingInstructionAssembler,
    ElementAssembler
} from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('ProcessingInstructionAssembler', () => {
    describe('new ProcessingInstructionAssembler', () => {
        const instruction = new ProcessingInstructionAssembler
        const node = instruction.node
        it('node', () => {
            assert.instanceOf(node, ProcessingInstruction)
        })
        it('node.target', () => {
            assert.equal(node.target, ProcessingInstructionAssembler.target)
        })
        it('node.data', () => {
            assert.equal(node.data, ProcessingInstructionAssembler.data)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<?instruction ?>')
        })
    })
    describe('new ProcessingInstructionAssembler(new String)', () => {
        const instruction = new ProcessingInstructionAssembler('foobar')
        const node = instruction.node
        it('node.target', () => {
            assert.equal(node.target, ProcessingInstructionAssembler.target)
        })
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<?instruction foobar?>')
        })
    })
    describe('new ProcessingInstructionAssembler({ target })', () => {
        const instruction = new ProcessingInstructionAssembler({ target : 'foobar' })
        const node = instruction.node
        it('node.target', () => {
            assert.equal(node.target, 'foobar')
        })
        it('node.data', () => {
            assert.equal(node.data, ProcessingInstructionAssembler.data)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<?foobar ?>')
        })
    })
    describe('new ProcessingInstructionAssembler({ data })', () => {
        const instruction = new ProcessingInstructionAssembler({ data : 'foobar' })
        const node = instruction.node
        it('node.target', () => {
            assert.equal(node.target, ProcessingInstructionAssembler.target)
        })
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<?instruction foobar?>')
        })
    })
    describe('new ProcessingInstructionAssembler({ target, data })', () => {
        const instruction = new ProcessingInstructionAssembler({
            target : 'xml-stylesheet',
            data : 'href="./style.css"'
        })
        const node = instruction.node
        it('node.target', () => {
            assert.equal(node.target, 'xml-stylesheet')
        })
        it('node.data', () => {
            assert.equal(node.data, 'href="./style.css"')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(node)
            const sample = '<?xml-stylesheet href="./style.css"?>'
            assert.equal(xml, sample)
        })
    })
    describe('new ProcessingInstructionAssembler({ node })', () => {
        const node = document.createProcessingInstruction('foo', 'bar')
        const instruction = new ProcessingInstructionAssembler({ node })
        it('nodes equal', () => {
            assert.equal(instruction.node, node)
        })
    })
    describe('data = new String', () => {
        const instruction = new ProcessingInstructionAssembler
        const node = instruction.node
        instruction.data = 'foobar'
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('data', () => {
            assert.equal(instruction.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<?instruction foobar?>')
        })
    })
    describe('new ProcessingInstructionAssembler({ target, data, parentNode })', () => {
        const element = new ElementAssembler
        const instruction = new ProcessingInstructionAssembler({
            target : 'foo',
            data : 'bar',
            parentNode : element
        })
        const node = instruction.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, element.node)
        })
        it('parentNode', () => {
            assert.equal(instruction.parentNode, element)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(element.node)
            assert.equal(xml, '<element><?foo bar?></element>')
        })
    })
})