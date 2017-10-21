import chai from 'chai'
import { DocumentType, DocumentTypeAssembler, DocumentAssembler } from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('DocumentTypeAssembler', () => {
    describe('new DocumentTypeAssembler', () => {
        const doctype = new DocumentTypeAssembler
        const node = doctype.node
        const name = DocumentTypeAssembler.qualifiedName
        it('instanceof DocumentType', () => {
            assert.instanceOf(node, DocumentType)
        })
        it('node.name', () => {
            assert.propertyVal(node, 'name', name)
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
            assert.propertyVal(node, 'name', 'html')
        })
        it('node.publicId', () => {
            assert.propertyVal(node, 'publicId', '-//W3C//DTD XHTML 1.1//EN')
        })
        it('node.systemId', () => {
            assert.propertyVal(node, 'systemId', 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(node)
            const sample = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
            assert.equal(xml, sample)
        })
    })
    /*describe('new DocumentTypeAssembler({ data })', () => {
        const doctype = new DocumentTypeAssembler({ data : 'foobar' })
        const node = doctype.node
        it('node.data', () => {
            assert.propertyVal(node, 'data', 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })
    describe('new DocumentTypeAssembler({ node })', () => {
        const node = document.createTextNode('foobar')
        const doctype = new DocumentTypeAssembler({ node })
        it('nodes equal', () => {
            assert.equal(doctype.node, node)
        })
    })
    describe('data = new String', () => {
        const doctype = new DocumentTypeAssembler
        const node = doctype.node
        doctype.data = 'foobar'
        it('node.data', () => {
            assert.propertyVal(node, 'data', 'foobar')
        })
        it('data', () => {
            assert.propertyVal(doctype, 'data', 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), 'foobar')
        })
    })*/
    /*describe.skip('new DocumentTypeAssembler({ qualifiedName, parentNode })', () => {
        const document = new DocumentAssembler
        const doctype = new DocumentTypeAssembler({
            qualifiedName : DocumentAssembler.qualifiedName,
            parentNode : document
        })
        const node = doctype.node
        it('node.parentNode', () => {
            assert.propertyVal(node, 'parentNode', document.node)
        })
        it('parentNode', () => {
            assert.propertyVal(doctype, 'parentNode', document)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(document.node)
            assert.equal(xml, '<!DOCTYPE document><document></document>')
        })
    })*/
})
