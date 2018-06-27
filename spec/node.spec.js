import chai from 'chai'
import { NodeAssembler } from '../lib/node'
import {
    AttrAssembler,
    CommentAssembler,
    DocumentAssembler,
    DocumentFragmentAssembler,
    DocumentTypeAssembler,
    ElementAssembler,
    TextAssembler
} from '../lib'

const { document } = window
const { implementation } = document
const { assert } = chai

describe('Node type resolving', () => {
    describe('AttrAssembler', () => {
        const node = document.createAttribute('foobar')
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, AttrAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('CommentAssembler', () => {
        const node = document.createComment('foobar')
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, CommentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentAssembler', () => {
        const node = implementation.createDocument('', 'foobar', null)
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, DocumentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentFragmentAssembler', () => {
        const node = document.createDocumentFragment()
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, DocumentFragmentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentTypeAssembler', () => {
        const node = implementation.createDocumentType('foobar', '', '')
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, DocumentTypeAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('ElementAssembler', () => {
        const node = document.createElementNS('', 'foobar')
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, ElementAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('TextAssembler', () => {
        const node = document.createTextNode('foobar')
        const instance = NodeAssembler.getInstanceOf(node)
        it('instance', () => {
            assert.instanceOf(instance, TextAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
})
