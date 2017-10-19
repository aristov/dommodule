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
            assert(node instanceof Attr, 'instanceof Attr')
        })
        it('node.name', () => {
            assert.equal(node.name, 'attr')
        })
        it('node.value', () => {
            assert.equal(node.value, '')
        })
    })
    describe('new AttrAssembler(new String)', () => {
        const attr = new AttrAssembler('foobar')
        const node = attr.node
        it('node.name', () => {
            assert.equal(node.name, 'attr')
        })
        it('node.value', () => {
            assert.equal(node.value, 'foobar')
        })
    })
    describe('new AttrAssembler({ name, value })', () => {
        const attr = new AttrAssembler({ name : 'foo', value : 'bar' })
        const node = attr.node
        it('node.name', () => {
            assert.equal(node.name, 'foo')
        })
        it('node.value', () => {
            assert.equal(node.value, 'bar')
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
            assert.equal(node.namespaceURI, 'http://www.w3.org/XML/1998/namespace')
        })
        it('node.prefix, node.localName, node.name', () => {
            assert.equal(node.prefix, 'xml')
            assert.equal(node.localName, 'id')
            assert.equal(node.name, 'xml:id')
        })
        it('node.value', () => {
            assert.equal(node.value, 'foobar')
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
            assert.equal(attr.node.value, 'foobar')
        })
        it('value', () => {
            assert.equal(attr.value, 'foobar')
        })
    })
    describe('ownerElement = new ElementAssembler', () => {
        const attr = new AttrAssembler({ value : 'foobar' })
        const element = new ElementAssembler
        attr.ownerElement = element
        it('node.ownerElement', () => {
            assert.equal(attr.node.ownerElement, element.node)
        })
        it('ownerElement', () => {
            assert.equal(attr.ownerElement, element)
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
            assert.equal(attr.node.ownerElement, elementNode)
        })
        it('ownerElement instanceof ElementAssembler', () => {
            assert(attr.ownerElement instanceof ElementAssembler,
                'ownerElement instanceof ElementAssembler')
        })
        it('ownerElement.node', () => {
            assert.equal(attr.ownerElement.node, elementNode)
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
            assert(!attr.node.ownerElement, '!node.ownerElement')
        })
        it('element.node.hasAttributes()', () => {
            assert(!element.node.hasAttributes(), '!element.node.hasAttributes()')
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(element.node)
            assert.equal(xml, '<element/>')
        })
    })
})
