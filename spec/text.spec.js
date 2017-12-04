import chai from 'chai'
import { TextAssembler, ElementAssembler } from '../lib'

const { assert } = chai
const { Text, XMLSerializer, document } = window
const serializer = new XMLSerializer

describe('TextAssembler', () => {
    describe('new TextAssembler', () => {
        const test = new TextAssembler
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Text)
        })
        it('node.data', () => {
            assert.equal(node.data, '')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '')
        })
    })
    describe('new TextAssembler({})', () => {
        const test = new TextAssembler({})
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Text)
        })
        it('node.data', () => {
            assert.equal(node.data, '')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '')
        })
    })
    describe('new TextAssembler(new String)', () => {
        const test = new TextAssembler('foobar')
        const node = test.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ nodeValue })', () => {
        const nodeValue = 'foobar'
        const test = new TextAssembler({ nodeValue })
        const node = test.node
        it('nodeValue', () => {
            assert.equal(test.nodeValue, nodeValue)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ data })', () => {
        const test = new TextAssembler({ data : 'foobar' })
        const node = test.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ node })', () => {
        const node = document.createTextNode('foobar')
        const test = new TextAssembler({ node })
        it('nodes equal', () => {
            assert.equal(test.node, node)
        })
    })
    describe('data = new String', () => {
        const test = new TextAssembler
        const node = test.node
        test.data = 'foobar'
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('data', () => {
            assert.equal(test.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ data, parentNode })', () => {
        const parent = new ElementAssembler
        const test = new TextAssembler({
            data : 'foobar',
            parentNode : parent
        })
        const node = test.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, parent.node)
        })
        it('parentNode', () => {
            assert.equal(test.parentNode, parent)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(parent.node)
            assert.equal(xml, '<element>foobar</element>')
        })
    })
})
