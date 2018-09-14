import chai from 'chai'
import { CommentAssembler, ElementAssembler } from '../lib'

const { assert } = chai
const { Comment, XMLSerializer, document } = window
const serializer = new XMLSerializer

class TestElement extends ElementAssembler {
    static get localName() {
        return 'element'
    }
}

describe('CommentAssembler', () => {
    describe('new CommentAssembler', () => {
        const test = new CommentAssembler
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Comment)
        })
        it('node.data', () => {
            assert.equal(node.data, '')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!---->')
        })
    })
    describe('new CommentAssembler({})', () => {
        const test = new CommentAssembler({})
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Comment)
        })
        it('node.data', () => {
            assert.equal(node.data, '')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!---->')
        })
    })
    describe('new CommentAssembler(new String)', () => {
        const test = new CommentAssembler('foobar')
        const node = test.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!--foobar-->')
        })
    })
    describe('new CommentAssembler({ data })', () => {
        const test = new CommentAssembler({ data : 'foobar' })
        const node = test.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!--foobar-->')
        })
    })
    describe('new CommentAssembler({ node })', () => {
        const node = document.createComment('foobar')
        const test = new CommentAssembler({ node })
        it('nodes equal', () => {
            assert.equal(test.node, node)
        })
    })
    describe('data = new String', () => {
        const test = new CommentAssembler
        const node = test.node
        test.data = 'foobar'
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('data', () => {
            assert.equal(test.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!--foobar-->')
        })
    })
    describe('new CommentAssembler({ data, parentNode })', () => {
        const parent = new TestElement
        const test = new CommentAssembler({
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
            assert.equal(xml, '<element><!--foobar--></element>')
        })
    })
})
