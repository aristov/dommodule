import chai from 'chai'
import { AttrAssembler, ElementAssembler } from '../lib'

const { assert } = chai
const { Attr, Node, XMLSerializer, document } = window
const serializer = new XMLSerializer

describe('AttrAssembler', () => {
    describe('new AttrAssembler', () => {
        const name = AttrAssembler.qualifiedName
        const test = new AttrAssembler
        it('node', () => {
            assert.instanceOf(test.node, Attr)
        })
        it('name', () => {
            assert.equal(test.name, name)
        })
        it('value', () => {
            assert.equal(test.value, '')
        })
        it.skip('nodeType', () => { // todo jsdom
            assert.equal(test.nodeType, Node.ATTRIBUTE_NODE)
        })
        it('nodeName', () => {
            assert.equal(test.nodeName, name)
        })
        it('nodeValue', () => {
            assert.equal(test.nodeValue, '')
        })
    })
    describe('new AttrAssembler({ name })', () => {
        const name = 'foobar'
        const test = new AttrAssembler({ name })
        it('name', () => {
            assert.equal(test.name, name)
        })
        it('value', () => {
            assert.equal(test.value, '')
        })
    })
    describe('new AttrAssembler({ name, value })', () => {
        const test = new AttrAssembler({ name : 'foo', value : 'bar' })
        it('name', () => {
            assert.equal(test.name, 'foo')
        })
        it('value', () => {
            assert.equal(test.value, 'bar')
        })
    })
    describe('new AttrAssembler({ namespace, prefix, localName, value })', () => {
        const test = new AttrAssembler({
            namespace : 'http://www.w3.org/XML/1998/namespace',
            prefix : 'xml',
            localName : 'id',
            value : 'foobar'
        })
        it('namespaceURI', () => {
            assert.equal(test.namespaceURI, 'http://www.w3.org/XML/1998/namespace')
        })
        it('prefix, localName, name', () => {
            assert.equal(test.prefix, 'xml')
            assert.equal(test.localName, 'id')
            assert.equal(test.name, 'xml:id')
        })
        it('value', () => {
            assert.equal(test.value, 'foobar')
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
        it('name', () => {
            assert.equal(test.name, 'attr')
        })
        it('value', () => {
            assert.equal(test.value, 'foobar')
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
            assert.match(xml, /^<element attr="foobar"\s?\/>$/)
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
            assert.match(xml, /^<foobar foo="bar"\s?\/>$/)
        })
    })
    describe('namespace, ownerElement = document.createElementNS()', () => {
        const test = new AttrAssembler({
            namespace : 'http://example.com/ns',
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
    describe('ownerElement = { localName }', () => {
        const test = new AttrAssembler({
            ownerElement : { localName : 'test' },
            name : 'foo',
            value : 'bar'
        })
        it('ownerElement', () => {
            assert.instanceOf(test.ownerElement, ElementAssembler)
        })
        it('ownerElement.hasAttribute()', () => {
            assert.equal(test.ownerElement.getAttribute('foo'), 'bar')
        })
        it('serializeToString(ownerElement.node)', () => {
            const xml = serializer.serializeToString(test.ownerElement.node)
            assert.match(xml, /^<test foo="bar"\s?\/>$/)
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
            assert.match(xml, /^<element\s?\/>$/)
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
            static get namespace() {
                return 'http://example.com/ns'
            }
            static get prefix() {
                return 'wiz'
            }
        }
        const test = new FooBar
        it('static qualifiedName', () => {
            assert.equal(FooBar.qualifiedName, 'wiz:foobar')
        })
        it('name', () => {
            assert.equal(test.name, 'wiz:foobar')
        })
        it('namespaceURI', () => {
            assert.equal(test.namespaceURI, 'http://example.com/ns')
        })
        it('value', () => {
            assert.equal(test.value, '')
        })
        it('static selector', () => {
            assert.equal(FooBar.selector, '[foobar]')
        })
    })
})
