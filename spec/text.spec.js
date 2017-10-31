import chai from 'chai'
import { TextAssembler, ElementAssembler } from '../lib'

const { assert } = chai
const { Text, XMLSerializer, document } = window
const serializer = new XMLSerializer

describe('TextAssembler', () => {
    describe('new TextAssembler', () => {
        const text = new TextAssembler
        const node = text.node
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
        const text = new TextAssembler({})
        const node = text.node
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
        const text = new TextAssembler('foobar')
        const node = text.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ data })', () => {
        const text = new TextAssembler({ data : 'foobar' })
        const node = text.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ node })', () => {
        const node = document.createTextNode('foobar')
        const text = new TextAssembler({ node })
        it('nodes equal', () => {
            assert.equal(text.node, node)
        })
    })
    describe('data = new String', () => {
        const text = new TextAssembler
        const node = text.node
        text.data = 'foobar'
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('data', () => {
            assert.equal(text.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new TextAssembler({ data, parentNode })', () => {
        const element = new ElementAssembler
        const text = new TextAssembler({
            data : 'foobar',
            parentNode : element
        })
        const node = text.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, element.node)
        })
        it('parentNode', () => {
            assert.equal(text.parentNode, element)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(element.node)
            assert.equal(xml, '<element>foobar</element>')
        })
    })
})
