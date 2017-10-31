import chai from 'chai'
import { INSTANCE_PROPERTY_NAME } from '../lib/const'
import {
    AttrAssembler,
    CommentAssembler,
    DocumentAssembler,
    DocumentFragmentAssembler,
    DocumentTypeAssembler,
    ElementAssembler,
    ProcessingInstructionAssembler,
    TextAssembler
} from '../lib'

const { Node, document } = window
const { implementation } = document
const { assert } = chai

describe('Node instance accessors', () => {
    it('Node.prototype.hasOwnProperty()', () => {
        assert(Node.prototype.hasOwnProperty(INSTANCE_PROPERTY_NAME), 'Node.prototype.hasOwnProperty()')
    })
    describe('AttrAssembler', () => {
        const node = document.createAttribute('foobar')
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, AttrAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('CommentAssembler', () => {
        const node = document.createComment('foobar')
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, CommentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentAssembler', () => {
        const node = implementation.createDocument('', 'foobar', null)
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, DocumentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentFragmentAssembler', () => {
        const node = document.createDocumentFragment()
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, DocumentFragmentAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('DocumentTypeAssembler', () => {
        const node = implementation.createDocumentType('foobar', '', '')
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, DocumentTypeAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('ProcessingInstructionAssembler', () => {
        const node = document.createProcessingInstruction('foo', 'bar')
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, ProcessingInstructionAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('ElementAssembler', () => {
        const node = document.createElementNS('', 'foobar')
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, ElementAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
    describe('TextAssembler', () => {
        const node = document.createTextNode('foobar')
        const instance = node[INSTANCE_PROPERTY_NAME]
        it('instance', () => {
            assert.instanceOf(instance, TextAssembler)
        })
        it('instance.node', () => {
            assert.equal(instance.node, node)
        })
    })
})
