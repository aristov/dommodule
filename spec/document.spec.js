import chai from 'chai'
import { Document, Element, XMLSerializer, document } from '../lib/dom'
import { DocumentAssembler, element, doctype } from '../lib'

const { assert } = chai

const { implementation } = document
const serializer = new XMLSerializer

describe('DocumentAssembler', () => {
    describe('new DocumentAssembler', () => {
        const doc = new DocumentAssembler
        const node = doc.node
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
    describe('new DocumentAssembler({ namespaceURI, qualifiedName })', () => {
        const doc = new DocumentAssembler({
            namespaceURI : 'http://www.w3.org/2000/svg',
            qualifiedName : 'svg:svg'
        })
        const node = doc.node
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
    describe('new DocumentAssembler({ doctype, documentElement })', () => {
        let $doctype, $element
        const $document = new DocumentAssembler({
            doctype : $doctype = doctype('example'),
            documentElement : $element = element({ localName : 'example' })
        })
        it('doctype', () => {
            assert.equal($document.doctype, $doctype)
        })
        it('element', () => {
            assert.equal($document.documentElement, $element)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString($document.node)
            const sample = '<!DOCTYPE example><example/>'
            assert.equal(xml, sample)
        })
    })
    describe('new DocumentAssembler({ doctype : node, documentElement : node })', () => {
        let $doctype, $element
        const $document = new DocumentAssembler({
            doctype : $doctype = implementation.createDocumentType('test', '', ''),
            documentElement : $element = document.createElementNS('', 'test')
        })
        it('doctype.node', () => {
            assert.equal($document.doctype.node, $doctype)
        })
        it('element.node', () => {
            assert.equal($document.documentElement.node, $element)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString($document.node)
            const sample = '<!DOCTYPE test><test/>'
            assert.equal(xml, sample)
        })
    })
})
