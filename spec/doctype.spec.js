import chai from 'chai'
import { DocumentType, XMLSerializer, document } from '../lib/dom'
import { DocumentTypeAssembler, DocumentAssembler, doctype } from '../lib'

const { assert } = chai
const { implementation } = document
const serializer = new XMLSerializer

describe('DocumentTypeAssembler', () => {
    describe('new DocumentTypeAssembler', () => {
        const $doctype = new DocumentTypeAssembler
        const node = $doctype.node
        const name = DocumentTypeAssembler.qualifiedName
        it('node', () => {
            assert.instanceOf(node, DocumentType)
        })
        it('node.name', () => {
            assert.equal(node.name, name)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), `<!DOCTYPE ${ name }>`)
        })
    })
    describe('new DocumentTypeAssembler(new String)', () => {
        const $doctype = new DocumentTypeAssembler('html')
        const node = $doctype.node
        it('node.name', () => {
            assert.equal(node.name, 'html')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!DOCTYPE html>')
        })
    })
    describe('new DocumentTypeAssembler({ qualifiedName, publicId, systemId })', () => {
        const $doctype = new DocumentTypeAssembler({
            qualifiedName : 'html',
            publicId : '-//W3C//DTD XHTML 1.1//EN',
            systemId : 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
        })
        const node = $doctype.node
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
        const $doctype = new DocumentTypeAssembler({ node })
        it('node', () => {
            assert.equal($doctype.node, node)
        })
    })
    describe('doctype({ qualifiedName, parentNode : new DocumentAssembler })', () => {
        const $document = new DocumentAssembler
        const $doctype = doctype({
            qualifiedName : DocumentAssembler.qualifiedName,
            parentNode : $document
        })
        const node = $doctype.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, $document.node)
        })
        it('parentNode', () => {
            assert.equal($doctype.parentNode, $document)
        })
        it('serializeToString(document.node)', () => {
            const xml = serializer.serializeToString($document.node)
            assert.equal(xml, '<!DOCTYPE document><document/>')
        })
    })
    describe('doctype({ parentNode : implementation.createDocument() })', () => {
        const doctypeNode = implementation.createDocumentType('test', '', '')
        const doc = implementation.createDocument('', 'test', doctypeNode)
        const $doctype = doctype({ parentNode : doc })
        const node = $doctype.node
        it('parentNode', () => {
            assert.equal(node.parentNode, doc)
        })
        it('serializeToString(document.node)', () => {
            const xml = serializer.serializeToString(doc)
            assert.equal(xml, '<!DOCTYPE document><test/>')
        })
    })
    describe('class extends DocumentTypeAssembler', () => {
        class Foobar extends DocumentTypeAssembler {}
        const $doctype = new Foobar
        it('node.name', () => {
            assert.equal($doctype.node.name, 'foobar')
        })
    })
})
