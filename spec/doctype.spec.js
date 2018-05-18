import chai from 'chai'
import {
    ElementAssembler,
    DocumentAssembler,
    DocumentTypeAssembler
} from '../lib'

const { assert } = chai
const { Document, DocumentType, XMLSerializer, document } = window
const { implementation } = document
const serializer = new XMLSerializer

class TestDocumentType extends DocumentTypeAssembler {
    static get qualifiedName() {
        return 'element'
    }
}

describe('DocumentTypeAssembler', () => {
    describe('new TestDocumentType', () => {
        const test = new TestDocumentType
        const node = test.node
        const name = TestDocumentType.qualifiedName
        it('node', () => {
            assert.instanceOf(node, DocumentType)
        })
        it('node.name', () => {
            assert.equal(node.name, name)
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<!DOCTYPE element(?: PUBLIC "" "")?>$/)
        })
    })
    describe('new DocumentTypeAssembler(new String)', () => {
        const test = new DocumentTypeAssembler('html')
        const node = test.node
        it('node.name', () => {
            assert.equal(node.name, 'html')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<!DOCTYPE html(?: PUBLIC "" "")?>$/)
        })
    })
    describe('new DocumentTypeAssembler({ qualifiedName, publicId, systemId })', () => {
        const test = new DocumentTypeAssembler({
            qualifiedName : 'html',
            publicId : '-//W3C//DTD XHTML 1.1//EN',
            systemId : 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
        })
        const node = test.node
        it('node.name', () => {
            assert.equal(node.name, 'html')
        })
        it('node.publicId', () => {
            assert.equal(node.publicId, '-//W3C//DTD XHTML 1.1//EN')
        })
        it('node.systemId', () => {
            assert.equal(node.systemId, 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(node)
            const sample = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
            assert.equal(xml, sample)
        })
    })
    describe('new DocumentTypeAssembler({ node })', () => {
        const node = implementation.createDocumentType('html', '', '')
        const test = new DocumentTypeAssembler({ node })
        it('node', () => {
            assert.equal(test.node, node)
        })
    })
    /*describe('doctype({ qualifiedName, parentNode : new DocumentAssembler })', () => { // todo MS Edge
        const doc = new DocumentAssembler
        const test = doctype({
            qualifiedName : 'example',
            parentNode : doc
        })
        const node = test.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, doc.node)
        })
        it('parentNode', () => {
            assert.equal(test.parentNode, doc)
        })
        it('serializeToString(document.node)', () => {
            const xml = serializer.serializeToString(doc.node)
            const sample = /^<\!DOCTYPE example>$/
            assert.match(xml, sample)
        })
    })*/
    /*describe('doctype({ parentNode : new Document })', () => { // todo MS Edge
        const doc = new Document
        const test = doctype({ parentNode : doc })
        const node = test.node
        it('parentNode', () => {
            assert.equal(node.parentNode, doc)
        })
        it('serializeToString(document.node)', () => {
            const xml = serializer.serializeToString(doc)
            const sample = /^<\!DOCTYPE element>/
            assert.match(xml, sample)
        })
    })*/
    describe('new TestDocumentType({ parentNode : implementation.createDocument() })', () => {
        const doctypeNode = implementation.createDocumentType('test', '', '')
        const doc = implementation.createDocument('', 'test', doctypeNode)
        const test = new TestDocumentType({ parentNode : doc })
        const node = test.node
        it('parentNode', () => {
            assert.equal(node.parentNode, doc)
        })
        it('serializeToString(document.node)', () => {
            const xml = serializer.serializeToString(doc)
            const sample = /^<\!DOCTYPE element(?: PUBLIC "" "")?>\n?<test\s?\/>/
            assert.match(xml, sample)
        })
    })
    describe('class extends DocumentTypeAssembler', () => {
        class Foobar extends ElementAssembler {}
        class FoobarDoc extends DocumentAssembler {
            static get elementAssembler() {
                return Foobar
            }
        }
        class FoobarDoctype extends DocumentTypeAssembler {
            static get documentAssembler() {
                return FoobarDoc
            }
        }
        const test = new FoobarDoctype
        it('node.name', () => {
            assert.equal(test.node.name, 'foobar')
        })
    })
})
