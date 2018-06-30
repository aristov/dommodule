import chai from 'chai'
import {
    AttrAssembler,
    CommentAssembler,
    DocumentAssembler,
    DocumentFragmentAssembler,
    DocumentTypeAssembler,
    ElementAssembler,
    TextAssembler
} from '../lib'

const { Document, document } = window
const { implementation } = document
const { assert } = chai

describe('Node type resolving', () => {
    describe('AttrAssembler', () => {
        const node = document.createAttribute('foobar')
        const instance = AttrAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, AttrAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('CommentAssembler', () => {
        const node = document.createComment('foobar')
        const instance = CommentAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, CommentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentAssembler', () => {
        const node = new Document
        const instance = DocumentAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, DocumentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentFragmentAssembler', () => {
        const node = document.createDocumentFragment()
        const instance = DocumentFragmentAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, DocumentFragmentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentTypeAssembler', () => {
        const node = implementation.createDocumentType('foobar', '', '')
        const instance = DocumentTypeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, DocumentTypeAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('ElementAssembler', () => {
        const node = document.createElementNS('', 'foobar')
        const instance = ElementAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, ElementAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('TextAssembler', () => {
        const node = document.createTextNode('foobar')
        const instance = TextAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, TextAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
})
