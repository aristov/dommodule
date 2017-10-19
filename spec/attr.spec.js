import chai from 'chai'
import { AttrAssembler, ElementAssembler } from '../lib/'

const { assert } = chai
const { Attr } = window

const serializer = new XMLSerializer

describe('AttrAssembler', () => {
    describe('new AttrAssembler', () => {
        const attr = new AttrAssembler
        const node = attr.node
        it('instanceof Attr', () => {
            assert.instanceOf(node, Attr)
        })
        it('node.name', () => {
            assert.propertyVal(node, 'name', 'attr')
        })
        it('node.value', () => {
            assert.propertyVal(node, 'value', '')
        })
    })
    describe('new AttrAssembler(new String)', () => {
        const attr = new AttrAssembler('foobar')
        const node = attr.node
        it('node.name', () => {
            assert.propertyVal(node, 'name', 'attr')
        })
        it('node.value', () => {
            assert.propertyVal(node, 'value', 'foobar')
        })
    })
    describe('new AttrAssembler({ name, value })', () => {
        const attr = new AttrAssembler({ name : 'foo', value : 'bar' })
        const node = attr.node
        it('node.name', () => {
            assert.propertyVal(node, 'name', 'foo')
        })
        it('node.value', () => {
            assert.propertyVal(node, 'value', 'bar')
        })
    })
    describe('new AttrAssembler({ namespaceURI, prefix, localName, value })', () => {
        const attr = new AttrAssembler({
            namespaceURI : 'http://www.w3.org/XML/1998/namespace',
            prefix : 'xml',
            localName : 'id',
            value : 'foobar'
        })
        const node = attr.node
        it('node.namespaceURI', () => {
            assert.propertyVal(node, 'namespaceURI', 'http://www.w3.org/XML/1998/namespace')
        })
        it('node.prefix, node.localName, node.name', () => {
            assert.propertyVal(node, 'prefix', 'xml')
            assert.propertyVal(node, 'localName', 'id')
            assert.propertyVal(node, 'name', 'xml:id')
        })
        it('node.value', () => {
            assert.propertyVal(node, 'value', 'foobar')
        })
    })
    describe('new AttrAssembler({ node })', () => {
        const node = document.createAttribute('foo')
        const attr = new AttrAssembler({ node })
        const attrNode = attr.node
        it('nodes equal', () => {
            assert.equal(attrNode, node)
        })
    })
    describe('value = new String', () => {
        const attr = new AttrAssembler
        attr.value = 'foobar'
        it('node.value', () => {
            assert.propertyVal(attr.node, 'value', 'foobar')
        })
        it('value', () => {
            assert.propertyVal(attr, 'value', 'foobar')
        })
    })
    describe('ownerElement = new ElementAssembler', () => {
        const attr = new AttrAssembler({ value : 'foobar' })
        const element = new ElementAssembler
        attr.ownerElement = element
        it('node.ownerElement', () => {
            assert.propertyVal(attr.node, 'ownerElement', element.node)
        })
        it('ownerElement', () => {
            assert.propertyVal(attr, 'ownerElement', element)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(element.node)
            assert.equal(xml, '<element attr="foobar"/>')
        })
    })
    describe('ownerElement = document.createElementNS()', () => {
        const attr = new AttrAssembler({ name : 'foo', value : 'bar' })
        const elementNode = document.createElementNS('', 'foobar')
        attr.ownerElement = elementNode
        it('node.ownerElement', () => {
            assert.propertyVal(attr.node, 'ownerElement', elementNode)
        })
        it('ownerElement instanceof ElementAssembler', () => {
            assert.instanceOf(attr.ownerElement, ElementAssembler)
        })
        it('ownerElement.node', () => {
            assert.propertyVal(attr.ownerElement, 'node', elementNode)
        })
        it('serializeToString(element)', () => {
            const xml = serializer.serializeToString(elementNode)
            assert.equal(xml, '<foobar foo="bar"/>')
        })
    })
    describe('ownerElement = null', () => {
        const attr = new AttrAssembler({ value : 'foobar' })
        const element = new ElementAssembler
        element.setAttributeNode(attr)
        attr.ownerElement = null
        it('attr.node.ownerElement', () => {
            assert.isNull(attr.node.ownerElement)
        })
        it('element.node.hasAttributes()', () => {
            assert.isFalse(element.node.hasAttributes())
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(element.node)
            assert.equal(xml, '<element/>')
        })
    })
    describe('ownerElement = true', () => {
        const attr = new AttrAssembler
        const fn = () => attr.ownerElement = true
        it('throws TypeError', () => {
            assert.throws(fn, TypeError)
        })
    })
})
