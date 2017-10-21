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
        it('instanceof Document', () => {
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
})
