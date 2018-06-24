import chai from 'chai'
import { DocumentAssembler, ElementAssembler, DocumentTypeAssembler } from '../lib'

const { assert } = chai
const { Document, Element, XMLSerializer, document } = window
const { implementation } = document
const serializer = new XMLSerializer

class TestElement extends ElementAssembler {
    static get localName() {
        return 'element'
    }
}

class TestDocument extends DocumentAssembler {
    static get elementAssembler() {
        return TestElement
    }
}

describe('DocumentAssembler', () => {
    describe('new DocumentAssembler', () => {
        const test = new DocumentAssembler
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Document)
        })
        it('node.documentElement', () => {
            assert.isNull(node.documentElement)
        })
        it('documentElement', () => {
            assert.isNull(test.documentElement)
        })
        it('node.doctype', () => {
            assert.isNull(node.doctype)
        })
        it('doctype', () => {
            assert.isNull(test.doctype)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '')
        })
    })
    describe('new DocumentAssembler({ doctype, documentElement })', () => {
        class Example extends ElementAssembler {}
        class ExampleDocument extends DocumentAssembler {
            static get elementAssembler() {
                return Example
            }
        }
        class ExampleDoctype extends DocumentTypeAssembler {
            static get documentAssembler() {
                return ExampleDocument
            }
        }
        let $doctype, $element
        const test = new DocumentAssembler({
            doctype : $doctype = new ExampleDoctype,
            documentElement : $element = new Example({ id : 'test' })
        })
        it('doctype', () => {
            assert.equal(test.doctype, $doctype)
        })
        it('documentElement', () => {
            assert.equal(test.documentElement, $element)
        })
        it('getElementById', () => {
            assert.equal(test.getElementById('test'), $element)
        })
        it('ownerDocument', () => {
            assert.equal($element.ownerDocument, test)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = /^<\!DOCTYPE example>\n?<example id="test"\/>$/
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
    describe('new DocumentAssembler; documentElement = document.createElementNS()', () => {
        const test = new DocumentAssembler
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
    describe('new TestDocument', () => {
        let test, node
        beforeEach(() => {
            test = new TestDocument
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
    describe('new TestDocument({ documentElement : new String })', () => {
        const test = new TestDocument({ documentElement : 'foobar' })
        const { documentElement } = test
        it('documentElement', () => {
            assert.instanceOf(documentElement, ElementAssembler)
        })
        it('documentElement.textContent', () => {
            assert.equal(documentElement.textContent, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element>foobar</element>'
            assert.equal(xml, sample)
        })
    })
})
