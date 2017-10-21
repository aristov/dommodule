import chai from 'chai'
import { DocumentType, DocumentTypeAssembler, DocumentAssembler } from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('DocumentTypeAssembler', () => {
    describe('new DocumentTypeAssembler', () => {
        const doctype = new DocumentTypeAssembler
        const node = doctype.node
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
        const doctype = new DocumentTypeAssembler('html')
        const node = doctype.node
        it('node.name', () => {
            assert.equal(node.name, 'html')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<!DOCTYPE html>')
        })
    })
    describe('new DocumentTypeAssembler({ qualifiedName, publicId, systemId })', () => {
        const doctype = new DocumentTypeAssembler({
            qualifiedName : 'html',
            publicId : '-//W3C//DTD XHTML 1.1//EN',
            systemId : 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
        })
        const node = doctype.node
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
    describe('new DocumentTypeAssembler({ qualifiedName, parentNode })', () => {
        const document = new DocumentAssembler
        const doctype = new DocumentTypeAssembler({
            qualifiedName : DocumentAssembler.qualifiedName,
            parentNode : document
        })
        const node = doctype.node
        it('node.parentNode', () => {
            assert.equal(node.parentNode, document.node)
        })
        it('parentNode', () => {
            assert.equal(doctype.parentNode, document)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(document.node)
            assert.equal(xml, '<!DOCTYPE document><document/>')
        })
    })
})
