import chai from 'chai'
import { Comment, CommentAssembler, ElementAssembler } from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('CommentAssembler', () => {
    describe('new CommentAssembler', () => {
        const text = new CommentAssembler
        const node = text.node
        it('instanceof Comment', () => {
            assert.instanceOf(node, Comment)
        })
        it('node.data', () => {
            assert.propertyVal(node, 'data', '')
        })
    })
    describe('new CommentAssembler(new String)', () => {
        const text = new CommentAssembler('foobar')
        it('node.data', () => {
            assert.propertyVal(text.node, 'data', 'foobar')
        })
    })
    describe('new CommentAssembler({ data })', () => {
        const text = new CommentAssembler({ data : 'foobar' })
        it('node.data', () => {
            assert.propertyVal(text.node, 'data', 'foobar')
        })
    })
    describe('new CommentAssembler({ node })', () => {
        const node = document.createComment('foobar')
        const text = new CommentAssembler({ node })
        it('nodes equal', () => {
            assert.equal(text.node, node)
        })
    })
    describe('data = new String', () => {
        const text = new CommentAssembler
        text.data = 'foobar'
        it('node.data', () => {
            assert.propertyVal(text.node, 'data', 'foobar')
        })
        it('data', () => {
            assert.propertyVal(text, 'data', 'foobar')
        })
    })
})
