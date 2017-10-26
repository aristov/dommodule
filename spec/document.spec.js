import chai from 'chai'
import { Document, Element, XMLSerializer, document } from '../lib/dom'
import { DocumentAssembler, ElementAssembler, element, doctype } from '../lib'

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
        it('documentElement', () => {
            assert.instanceOf(doc.documentElement, ElementAssembler)
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
        it('doctype', () => {
            assert.isNull(doc.doctype)
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
    describe('new DocumentAssembler({ documentElement : null })', () => {
        const doc = new DocumentAssembler({ documentElement : null })
        const node = doc.node
        it('doctype', () => {
            assert.isNull(doc.doctype)
        })
        it('documentElement', () => {
            assert.isNull(doc.documentElement)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '')
        })
        it('doctype = implementation.createDocumentType(); doctype.node', () => {
            const $doctype = implementation.createDocumentType('test', '', '')
            doc.doctype = $doctype
            assert.equal(doc.doctype.node, $doctype)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!DOCTYPE test>')
        })
        it('documentElement = new String; documentElement.textContent', () => {
            doc.documentElement = 'foobar'
            assert.equal(doc.documentElement.textContent, 'foobar')
        })
        it('serializeToString(node)', () => {
            const sample = '<!DOCTYPE test><element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
        it('doctype = implementation.createDocumentType(); doctype.node', () => {
            const $doctype = implementation.createDocumentType('example', '', '')
            doc.doctype = $doctype
            assert.equal(doc.doctype.node, $doctype)
        })
        it('serializeToString(node)', () => {
            const sample = '<!DOCTYPE example><element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
        it('doctype.remove(); doctype = implementation.createDocumentType(); doctype.node', () => {
            const $doctype = implementation.createDocumentType('element', '', '')
            doc.doctype.remove()
            doc.doctype = $doctype
            assert.equal(doc.doctype.node, $doctype)
        })
        it('serializeToString(node)', () => {
            const sample = '<!DOCTYPE element><element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new DocumentAssembler({ node })', () => {
        const node = implementation.createDocument('', 'example', null)
        const doc = new DocumentAssembler({ node })
        it('node', () => {
            assert.equal(doc.node, node)
        })
        it('doctype', () => {
            assert.isNull(doc.doctype)
        })
        it('documentElement.node', () => {
            assert.equal(doc.documentElement.node, node.documentElement)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(doc.node)
            const sample = '<example/>'
            assert.equal(xml, sample)
        })
    })
    describe('new DocumentAssembler({ documentElement : new String })', () => {
        const doc = new DocumentAssembler({ documentElement : 'foobar' })
        const { documentElement } = doc
        it('documentElement', () => {
            assert.instanceOf(documentElement, ElementAssembler)
        })
        it('documentElement.textContent', () => {
            assert.equal(documentElement.textContent, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(doc.node)
            const sample = '<document>foobar</document>'
            assert.equal(xml, sample)
        })
    })
    describe('class extends DocumentAssembler', () => {
        class FooBar extends DocumentAssembler {}
        it('qualifiedName', () => {
            assert.equal(FooBar.qualifiedName, ElementAssembler.qualifiedName)
        })
    })
})
