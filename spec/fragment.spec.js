import chai from 'chai'
import {
    CommentAssembler,
    DocumentFragmentAssembler,
    ElementAssembler,
    ProcessingInstructionAssembler,
    TextAssembler,
} from '../lib'

const { assert } = chai
const {
    Comment, DocumentFragment, Element,
    ProcessingInstruction, Text,
    XMLSerializer, document
} = window
const serializer = new XMLSerializer

describe('DocumentFragmentAssembler', () => {
    describe('new DocumentFragmentAssembler', () => {
        const test = new DocumentFragmentAssembler
        const node = test.node
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
    describe('new DocumentFragmentAssembler({ node : document.createDocumentFragment() })', () => {
        const node = document.createDocumentFragment()
        const test = new DocumentFragmentAssembler({ node })
        it('node', () => {
            assert.equal(test.node, node)
        })
    })
    describe('new DocumentFragmentAssembler(new Array)', () => {
        let element, test, node
        beforeEach(() => {
            element = document.createElementNS('', 'foo')
            test = new DocumentFragmentAssembler([
                document.createComment('foobar'),
                document.createElementNS('', 'bar'),
                document.createProcessingInstruction('foo', 'bar'),
                document.createTextNode('foobar'),
            ])
            node = test.node
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childElementCount', () => {
            assert.equal(node.childElementCount, 1)
        })
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 4)
        })
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 4)
        })
        it('childNodes[0]', () => {
            assert.instanceOf(test.childNodes[0], CommentAssembler)
        })
        it('childNodes[1]', () => {
            assert.instanceOf(test.childNodes[1], ElementAssembler)
        })
        it('childNodes[2]', () => {
            assert.instanceOf(test.childNodes[2], ProcessingInstructionAssembler)
        })
        it('childNodes[3]', () => {
            assert.instanceOf(test.childNodes[3], TextAssembler)
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
            test.parentNode = element
            const xml = serializer.serializeToString(element)
            const sample = '<foo><!--foobar--><bar/><?foo bar?>foobar</foo>'
            assert.equal(xml, sample)
            assert.isFalse(node.hasChildNodes())
            assert.equal(node.childElementCount, 0)
        })
    })
})
