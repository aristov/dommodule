import chai from 'chai'
import { DocumentAssembler, ElementAssembler, element, doctype } from '../lib'

const { assert } = chai
const { Document, Element, XMLSerializer, document } = window
const { implementation } = document
const serializer = new XMLSerializer

describe('DocumentAssembler', () => {
    describe('new DocumentAssembler', () => {
        const test = new DocumentAssembler
        const node = test.node
        const elemNode = node.documentElement
        const name = DocumentAssembler.qualifiedName
        it('node', () => {
            assert.instanceOf(node, Document)
        })
        it('node.documentElement', () => {
            assert.instanceOf(node.documentElement, Element)
        })
        it('documentElement', () => {
            assert.instanceOf(test.documentElement, ElementAssembler)
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
            assert.isNull(test.doctype)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<document/>')
        })
    })
    describe('new DocumentAssembler({ namespace, qualifiedName })', () => {
        const test = new DocumentAssembler({
            namespace : 'http://www.w3.org/2000/svg',
            qualifiedName : 'svg:svg'
        })
        const node = test.node
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
        const test = new DocumentAssembler({
            doctype : $doctype = doctype('example'),
            documentElement : $element = element({ localName : 'example' })
        })
        it('doctype', () => {
            assert.equal(test.doctype, $doctype)
        })
        it('documentElement', () => {
            assert.equal(test.documentElement, $element)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = /^<\!DOCTYPE example>\n?<example\/>$/
            assert.match(xml, sample)
        })
    })
    describe('new DocumentAssembler({ doctype : node, documentElement : node })', () => {
        let $doctype, $element
        const test = new DocumentAssembler({
            doctype : $doctype = implementation.createDocumentType('test', '', ''),
            documentElement : $element = document.createElementNS('', 'test')
        })
        it('doctype.node', () => {
            assert.equal(test.doctype.node, $doctype)
        })
        it('documentElement.node', () => {
            assert.equal(test.documentElement.node, $element)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = /^<\!DOCTYPE test>\n?<test\/>$/
            assert.match(xml, sample)
        })
    })
    describe('new DocumentAssembler({ documentElement : null }); documentElement = document.createElementNS()', () => {
        const test = new DocumentAssembler({ documentElement : null })
        const element = document.createElementNS('', 'test')
        test.documentElement = element
        it('documentElement.node', () => {
            assert.equal(test.documentElement.node, element)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<test/>')
        })
    })
    describe('new DocumentAssembler({ documentElement : null })', () => {
        let test, node
        beforeEach(() => {
            test = new DocumentAssembler({ documentElement : null })
            node = test.node
        })
        it('doctype', () => {
            assert.isNull(test.doctype)
        })
        it('documentElement', () => {
            assert.isNull(test.documentElement)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '')
        })
        it('<...>; serializeToString(node)', () => {
            {
                const $doctype = implementation.createDocumentType('test', '', '')
                test.doctype = $doctype
                assert.equal(test.doctype.node, $doctype)
            }
            ''
            {
                assert.equal(serializer.serializeToString(node), '<!DOCTYPE test>')
            }
            'documentElement = new String; documentElement.textContent'
            {
                test.documentElement = 'foobar'
                assert.equal(test.documentElement.textContent, 'foobar')
            }
            'serializeToString(node)'
            {
                const sample = /^<\!DOCTYPE test>\n?<element>foobar<\/element>$/
                assert.match(serializer.serializeToString(node), sample)
            }
            'doctype = implementation.createDocumentType(); doctype.node'
            {
                const $doctype = implementation.createDocumentType('example', '', '')
                test.doctype = $doctype
                assert.equal(test.doctype.node, $doctype)
            }
            'serializeToString(node)'
            {
                const sample = /^<\!DOCTYPE example>\n?<element>foobar<\/element>$/
                assert.match(serializer.serializeToString(node), sample)
            }
            'doctype.remove(); doctype = implementation.createDocumentType(); doctype.node'
            {
                const $doctype = implementation.createDocumentType('element', '', '')
                test.doctype.remove()
                test.doctype = $doctype
                assert.equal(test.doctype.node, $doctype)
            }
            'serializeToString(node)'
            {
                const sample = /^<\!DOCTYPE element>\n?<element>foobar<\/element>$/
                assert.match(serializer.serializeToString(node), sample)
            }
        })
    })
    describe('new DocumentAssembler({ node })', () => {
        const node = implementation.createDocument('', 'example', null)
        const test = new DocumentAssembler({ node })
        it('node', () => {
            assert.equal(test.node, node)
        })
        it('doctype', () => {
            assert.isNull(test.doctype)
        })
        it('documentElement.node', () => {
            assert.equal(test.documentElement.node, node.documentElement)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<example/>'
            assert.equal(xml, sample)
        })
    })
    describe('new DocumentAssembler({ documentElement : new String })', () => {
        const test = new DocumentAssembler({ documentElement : 'foobar' })
        const { documentElement } = test
        it('documentElement', () => {
            assert.instanceOf(documentElement, ElementAssembler)
        })
        it('documentElement.textContent', () => {
            assert.equal(documentElement.textContent, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
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
