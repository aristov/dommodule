import chai from 'chai'
import { AttrAssembler, ElementAssembler } from '../lib'

const { assert } = chai
const { Attr, XMLSerializer, document } = window
const serializer = new XMLSerializer

describe('AttrAssembler', () => {
    describe('new AttrAssembler', () => {
        const name = AttrAssembler.qualifiedName
        const test = new AttrAssembler
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Attr)
        })
        it('node.name', () => {
            assert.equal(node.name, name)
        })
        it('node.value', () => {
            assert.equal(node.value, '')
        })
        it('name', () => {
            assert.equal(test.name, name)
        })
    })
    describe('new AttrAssembler({ name })', () => {
        const name = 'foobar'
        const test = new AttrAssembler({ name })
        const node = test.node
        it('node.name', () => {
            assert.equal(node.name, name)
        })
        it('node.value', () => {
            assert.equal(node.value, '')
        })
    })
    describe('new AttrAssembler({ name, value })', () => {
        const test = new AttrAssembler({ name : 'foo', value : 'bar' })
        const node = test.node
        it('node.name', () => {
            assert.equal(node.name, 'foo')
        })
        it('node.value', () => {
            assert.equal(node.value, 'bar')
        })
    })
    describe('new AttrAssembler({ namespaceURI, prefix, localName, value })', () => {
        const test = new AttrAssembler({
            namespaceURI : 'http://www.w3.org/XML/1998/namespace',
            prefix : 'xml',
            localName : 'id',
            value : 'foobar'
        })
        const node = test.node
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
        const test = new AttrAssembler({ node })
        it('nodes equal', () => {
            assert.equal(test.node, node)
        })
        it('ownerElement', () => {
            assert.isNull(test.ownerElement)
        })
    })
    describe('new AttrAssembler(new String)', () => {
        const test = new AttrAssembler('foobar')
        const node = test.node
        it('node.name', () => {
            assert.equal(node.name, 'attr')
        })
        it('node.value', () => {
            assert.equal(node.value, 'foobar')
        })
    })
    describe('value = new String', () => {
        const test = new AttrAssembler
        test.value = 'foobar'
        it('node.value', () => {
            assert.equal(test.node.value, 'foobar')
        })
        it('value', () => {
            assert.equal(test.value, 'foobar')
        })
    })
    describe('ownerElement = new ElementAssembler', () => {
        const test = new AttrAssembler({ value : 'foobar' })
        const ownerElement = new ElementAssembler
        test.ownerElement = ownerElement
        it('node.ownerElement', () => {
            assert.equal(test.node.ownerElement, ownerElement.node)
        })
        it('ownerElement', () => {
            assert.equal(test.ownerElement, ownerElement)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(ownerElement.node)
            assert.equal(xml, '<element attr="foobar"/>')
        })
    })
    describe('ownerElement = document.createElementNS()', () => {
        const test = new AttrAssembler({ name : 'foo', value : 'bar' })
        const elementNode = document.createElementNS('', 'foobar')
        test.ownerElement = elementNode
        it('node.ownerElement', () => {
            assert.equal(test.node.ownerElement, elementNode)
        })
        it('ownerElement', () => {
            assert.instanceOf(test.ownerElement, ElementAssembler)
        })
        it('ownerElement.node', () => {
            assert.equal(test.ownerElement.node, elementNode)
        })
        it('serializeToString(element)', () => {
            const xml = serializer.serializeToString(elementNode)
            assert.equal(xml, '<foobar foo="bar"/>')
        })
    })
    describe('namespaceURI, ownerElement = document.createElementNS()', () => {
        const test = new AttrAssembler({
            namespaceURI : 'http://example.com/ns',
            name : 'foo:bar',
            value : 'wiz'
        })
        const elementNode = document.createElementNS('', 'foobar')
        test.ownerElement = elementNode
        it('node.ownerElement', () => {
            assert.equal(test.node.ownerElement, elementNode)
        })
        it('ownerElement', () => {
            assert.instanceOf(test.ownerElement, ElementAssembler)
        })
        it('ownerElement.node', () => {
            assert.equal(test.ownerElement.node, elementNode)
        })
        it('serializeToString(element)', () => {
            const xml = serializer.serializeToString(elementNode)
            const sample = /^<foobar .+\/>$/
            assert.match(xml, sample)
            assert.match(xml, / xmlns\:foo="http\:\/\/example.com\/ns"/)
            assert.match(xml, / foo\:bar="wiz"/)
        })
    })
    describe('ownerElement = null', () => {
        const test = new AttrAssembler({ value : 'foobar' })
        const ownerElement = new ElementAssembler
        ownerElement.setAttributeNode(test)
        test.ownerElement = null
        it('node.ownerElement', () => {
            assert.isNull(test.node.ownerElement)
        })
        it('element.node.hasAttributes()', () => {
            assert.isFalse(ownerElement.node.hasAttributes())
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(ownerElement.node)
            assert.equal(xml, '<element/>')
        })
    })
    describe('ownerElement = true', () => {
        const test = new AttrAssembler
        const fn = () => test.ownerElement = true
        it('throws TypeError', () => {
            assert.throws(fn, TypeError)
        })
    })
    describe('new AttrAssembler({ ownerElement }); remove()', () => {
        const ownerElement = new ElementAssembler
        const test = new AttrAssembler({ ownerElement })
        test.remove()
        it('ownerElement.node.hasAttribute()', () => {
            assert.isFalse(ownerElement.node.hasAttribute(AttrAssembler.localName))
        })
    })
    describe('remove()', () => {
        const test = new AttrAssembler
        const fn = () => test.remove()
        it('throws TypeError', () => {
            assert.throws(fn, TypeError)
        })
    })
    describe('class extends AttrAssembler', () => {
        class FooBar extends AttrAssembler {
            static get namespaceURI() {
                return 'http://example.com/ns'
            }
            static get prefix() {
                return 'wiz'
            }
            static get value() {
                return 'qwerty'
            }
        }
        const test = new FooBar
        const node = test.node
        it('static qualifiedName', () => {
            assert.equal(FooBar.qualifiedName, 'wiz:foobar')
        })
        it('node.name', () => {
            assert.equal(node.name, 'wiz:foobar')
        })
        it('node.namespaceURI', () => {
            assert.equal(node.namespaceURI, 'http://example.com/ns')
        })
        it('node.value', () => {
            assert.equal(node.value, 'qwerty')
        })
    })
})
