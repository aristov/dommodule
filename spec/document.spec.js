import chai from 'chai'
import { Document, Element, DocumentAssembler, ElementAssembler } from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('DocumentAssembler', () => {
    describe('new DocumentAssembler', () => {
        const document = new DocumentAssembler
        const node = document.node
        const elemNode = node.documentElement
        const name = DocumentAssembler.qualifiedName
        it('node', () => {
            assert.instanceOf(node, Document)
        })
        it('node.documentElement', () => {
            assert.instanceOf(node.documentElement, Element)
        })
        it('elemNode.namespaceURI', () => {
            assert.isNull(elemNode.namespaceURI)
        })
        it('elemNode.tagName', () => {
            assert.equal(elemNode.tagName, name)
        })
        it('node.doctype', () => {
            assert.isNull(node.doctype)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<document/>')
        })
    })
    describe('new DocumentAssembler({ namespaceURI, prefix, localName })', () => {
        const document = new DocumentAssembler({
            namespaceURI : 'http://www.w3.org/2000/svg',
            prefix : 'svg',
            localName : 'svg'
        })
        const node = document.node
        const elemNode = node.documentElement
        it('node', () => {
            assert.instanceOf(node, Document)
        })
        it('node.documentElement', () => {
            assert.instanceOf(node.documentElement, Element)
        })
        it('elemNode.namespaceURI', () => {
            assert.equal(elemNode.namespaceURI, 'http://www.w3.org/2000/svg')
        })
        it('elemNode.tagName', () => {
            assert.equal(elemNode.tagName, 'svg:svg')
        })
        it('node.doctype', () => {
            assert.isNull(node.doctype)
        })
        it('serializeToString(node)', () => {
            const sample = '<svg:svg xmlns:svg="http://www.w3.org/2000/svg"/>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
})
