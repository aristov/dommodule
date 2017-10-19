import chai from 'chai'
import { TextAssembler, ElementAssembler } from '../lib/'

const { assert } = chai
const { Text } = window

const serializer = new XMLSerializer

describe('TextAssembler', () => {
    describe('new TextAssembler', () => {
        const text = new TextAssembler
        const node = text.node
        it('instanceof Text', () => {
            assert.instanceOf(node, Text)
        })
        it('node.data', () => {
            assert.propertyVal(node, 'data', '')
        })
    })
    describe('new TextAssembler(new String)', () => {
        const text = new TextAssembler('foobar')
        it('node.data', () => {
            assert.propertyVal(text.node, 'data', 'foobar')
        })
    })
    describe('new TextAssembler({ data })', () => {
        const text = new TextAssembler({ data : 'foobar' })
        it('node.data', () => {
            assert.propertyVal(text.node, 'data', 'foobar')
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
        text.data = 'foobar'
        it('node.data', () => {
            assert.propertyVal(text.node, 'data', 'foobar')
        })
        it('data', () => {
            assert.propertyVal(text, 'data', 'foobar')
        })
    })
})
