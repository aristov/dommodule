import chai from 'chai'
import {
    CommentAssembler, ElementAssembler,
    Comment, XMLSerializer, document
} from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('CommentAssembler', () => {
    describe('new CommentAssembler', () => {
        const comment = new CommentAssembler
        const node = comment.node
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
        const comment = new CommentAssembler('foobar')
        const node = comment.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!--foobar-->')
        })
    })
    describe('new CommentAssembler({ data })', () => {
        const comment = new CommentAssembler({ data : 'foobar' })
        const node = comment.node
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!--foobar-->')
        })
    })
    describe('new CommentAssembler({ node })', () => {
        const node = document.createComment('foobar')
        const comment = new CommentAssembler({ node })
        it('nodes equal', () => {
            assert.equal(comment.node, node)
        })
    })
    describe('data = new String', () => {
        const comment = new CommentAssembler
        const node = comment.node
        comment.data = 'foobar'
        it('node.data', () => {
            assert.equal(node.data, 'foobar')
        })
        it('data', () => {
            assert.equal(comment.data, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!--foobar-->')
        })
    })
    describe('new CommentAssembler({ data, parentNode })', () => {
        const element = new ElementAssembler
        const comment = new CommentAssembler({
            data : 'foobar',
            parentNode : element
        })
        const node = comment.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, element.node)
        })
        it('parentNode', () => {
            assert.equal(comment.parentNode, element)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(element.node)
            assert.equal(xml, '<element><!--foobar--></element>')
        })
    })
})
