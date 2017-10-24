import chai from 'chai'
import {
    Comment,
    DocumentFragment,
    DocumentFragmentAssembler,
    Element,
    ProcessingInstruction,
    Text,
    XMLSerializer,
    document
} from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('DocumentFragmentAssembler', () => {
    describe('new DocumentFragmentAssembler', () => {
        const fragment = new DocumentFragmentAssembler
        const node = fragment.node
        it('node', () => {
            assert.instanceOf(node, DocumentFragment)
        })
        it('node.hasChildNodes()', () => {
            assert.isFalse(node.hasChildNodes())
        })
        it('node.childElementCount', () => {
            assert.equal(node.childElementCount, 0)
        })
    })
    describe('new DocumentFragmentAssembler(new Array)', () => {
        const element = document.createElementNS('', 'foo')
        const fragment = new DocumentFragmentAssembler([
            document.createComment('foobar'),
            document.createElementNS('', 'bar'),
            document.createProcessingInstruction('foo', 'bar'),
            document.createTextNode('foobar'),
        ])
        const node = fragment.node
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childElementCount', () => {
            assert.equal(node.childElementCount, 1)
        })
        it('node.childNodes.length', () => {
            assert(node.childNodes.length, 4)
        })
        it('node.firstChild', () => {
            assert.instanceOf(node.firstChild, Comment)
        })
        it('node.lastChild', () => {
            assert.instanceOf(node.lastChild, Text)
        })
        it('node.firstElementChild', () => {
            assert.instanceOf(node.firstElementChild, Element)
        })
        it('node.childNodes[2]', () => {
            assert.instanceOf(node.childNodes[2], ProcessingInstruction)
        })
        it('parentNode = element; serializeToString(element)', () => {
            fragment.parentNode = element
            const xml = serializer.serializeToString(element)
            const sample = '<foo><!--foobar--><bar/><?foo bar?>foobar</foo>'
            assert.equal(xml, sample)
            assert.isFalse(node.hasChildNodes())
            assert.equal(node.childElementCount, 0)
        })
    })
})
