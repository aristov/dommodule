import chai from 'chai'
import { Element, Text, XMLSerializer, document } from '../lib/dom'
import {
    AttrAssembler,
    DocumentAssembler,
    ElementAssembler,
    TextAssembler,
    element
} from '../lib'

const { assert } = chai
const serializer = new XMLSerializer

describe('ElementAssembler', () => {
    describe('new ElementAssembler', () => {
        const test = new ElementAssembler
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Element)
        })
        it('node.constructor', () => {
            assert.equal(node.constructor, Element)
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('new ElementAssembler({ localName })', () => {
        const test = new ElementAssembler({ localName : 'foobar' })
        const node = test.node
        it('node.localName', () => {
            assert.equal(node.localName, 'foobar')
        })
        it('node.prefix', () => {
            assert.isNull(node.prefix)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<foobar/>')
        })
    })
    describe('new ElementAssembler({ qualifiedName })', () => {
        const test = new ElementAssembler({ qualifiedName : 'foobar' })
        const node = test.node
        it('node.namespaceURI', () => {
            assert.isNull(node.namespaceURI)
        })
        it('node.prefix', () => {
            assert.isNull(node.prefix)
        })
        it('node.localName', () => {
            assert.equal(node.localName, 'foobar')
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<foobar/>')
        })
    })
    describe('new ElementAssembler({ namespaceURI, prefix, localName })', () => {
        const test = new ElementAssembler({
            namespaceURI : 'http://example.com/namespace',
            prefix : 'foo',
            localName : 'bar'
        })
        const node = test.node
        it('node.namespaceURI', () => {
            assert.equal(node.namespaceURI, 'http://example.com/namespace')
        })
        it('node.prefix', () => {
            assert.equal(node.prefix, 'foo')
        })
        it('node.localName', () => {
            assert.equal(node.localName, 'bar')
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foo:bar')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('serializeToString(node)', () => {
            const sample = '<foo:bar xmlns:foo="http://example.com/namespace"/>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new ElementAssembler({ namespaceURI, qualifiedName })', () => {
        const test = new ElementAssembler({
            namespaceURI : 'http://example.com/namespace',
            qualifiedName : 'foo:bar'
        })
        const node = test.node
        it('node.namespaceURI', () => {
            assert.equal(node.namespaceURI, 'http://example.com/namespace')
        })
        it('node.prefix', () => {
            assert.equal(node.prefix, 'foo')
        })
        it('node.localName', () => {
            assert.equal(node.localName, 'bar')
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foo:bar')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('serializeToString(node)', () => {
            const sample = '<foo:bar xmlns:foo="http://example.com/namespace"/>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new ElementAssembler({ node : document.createElementNS() })', () => {
        const foobar = document.createElementNS('', 'foobar')
        const test = new ElementAssembler({ node : foobar })
        const node = test.node
        it('node', () => {
            assert.equal(node, foobar)
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foobar')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.hasChildNodes()', () => {
            assert.isFalse(node.hasChildNodes())
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<foobar/>')
        })
    })
    describe('new ElementAssembler({ node : document.createTextNode() })', () => {
        const foobar = document.createTextNode('foobar')
        const fn = () => new ElementAssembler({ node : foobar })
        it('throws TypeError', () => {
            assert.throws(fn, TypeError)
        })
    })
    describe('new ElementAssembler(new ElementAssembler)', () => {
        const child = new ElementAssembler
        const test = new ElementAssembler(child)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.equal(node.firstChild, child.node)
        })
        it('serializeToString(node)', () => {
            const sample = '<element><element/></element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new ElementAssembler(document.createElementNS())', () => {
        const childNode = document.createElementNS('', 'child')
        const test = new ElementAssembler(childNode)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.equal(node.firstChild, childNode)
        })
        it('serializeToString(node)', () => {
            const sample = '<element><child/></element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new ElementAssembler(new TextAssembler)', () => {
        const data = 'foobar'
        const text = new TextAssembler(data)
        const test = new ElementAssembler(text)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.equal(node.firstChild, text.node)
        })
        it('node.textContent', () => {
            assert.equal(node.textContent, data)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new ElementAssembler(document.createTextNode())', () => {
        const textNode = document.createTextNode('foobar')
        const test = new ElementAssembler(textNode)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.equal(node.firstChild, textNode)
        })
        it('node.textContent', () => {
            assert.equal(node.textContent, textNode.data)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new ElementAssembler(new String)', () => {
        const textContent = 'foobar'
        const test = new ElementAssembler(textContent)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.instanceOf(node.firstChild, Text)
        })
        it('node.textContent', () => {
            assert.equal(node.textContent, textContent)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('getAttributeNode(new String)', () => {
        const test = new ElementAssembler
        const node = test.node
        node.setAttribute('foo', 'bar')
        const attr = test.getAttributeNode('foo')
        it('instanceof AttrAssembler', () => {
            assert.instanceOf(attr, AttrAssembler)
        })
        it('node.localName', () => {
            assert.equal(attr.node.localName, 'foo')
        })
        it('node.value', () => {
            assert.equal(attr.node.value, 'bar')
        })
    })
    describe('getAttributeNode(AttrAssembler)', () => {
        const test = new ElementAssembler
        const node = test.node
        node.setAttribute(AttrAssembler.localName, 'foobar')
        const attr = test.getAttributeNode(AttrAssembler)
        const attrNode = attr.node
        it('instanceof', () => {
            assert.instanceOf(attr, AttrAssembler)
        })
        it('attrNode.localName', () => {
            assert.equal(attrNode.localName, AttrAssembler.localName)
        })
        it('attrNode.value', () => {
            assert.equal(attrNode.value, 'foobar')
        })
    })
    describe('getAttributeNode(class extends AttrAssembler)', () => {
        const test = new ElementAssembler
        const node = test.node
        class Bar extends AttrAssembler {
            static get prefix() {
                return 'foo'
            }
            static get namespaceURI() {
                return 'http://example.com/ns'
            }
        }
        node.setAttributeNS(Bar.namespaceURI, Bar.qualifiedName, 'test')
        const attr = test.getAttributeNode(Bar)
        const attrNode = attr.node
        it('instanceof', () => {
            assert.instanceOf(attr, Bar)
        })
        it('attrNode.name', () => {
            assert.equal(attrNode.name, Bar.qualifiedName)
        })
        it('attrNode.value', () => {
            assert.equal(attrNode.value, 'test')
        })
    })
    describe('setAttributeNode(document.createAttribute())', () => {
        const test = new ElementAssembler
        const node = test.node
        const attrNode = document.createAttribute('foo')
        attrNode.value = 'bar'
        test.setAttributeNode(attrNode)
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 1)
        })
        it('node.hasAttribute()', () => {
            assert(node.hasAttribute('foo'), 'node.hasAttribute()')
        })
        it('node.getAttribute()', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
    describe('setAttributeNode(new AttrAssembler)', () => {
        const test = new ElementAssembler({ attrset : { foo : 'wiz' } })
        const node = test.node
        const attr = new AttrAssembler({ name : 'foo', value : 'bar' })
        test.setAttributeNode(attr)
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 1)
        })
        it('node.hasAttribute()', () => {
            assert(node.hasAttribute('foo'), 'node.hasAttribute()')
        })
        it('node.getAttribute()', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('getAttributeNode()', () => {
            assert.equal(test.getAttributeNode('foo'), attr)
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
    describe('removeAttributeNode(new AttrAssembler)', () => {
        const test = new ElementAssembler()
        const node = test.node
        const attr = new AttrAssembler('foobar')
        test.setAttributeNode(attr)
        const removedAttr = test.removeAttributeNode(attr)
        it('attrs equal', () => {
            assert.equal(removedAttr, attr)
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 0)
        })
        it('node.hasAttribute()', () => {
            assert.isFalse(node.hasAttribute(AttrAssembler.localName))
        })
        it('removeAttributeNode()', () => {
            assert.isNull(test.removeAttributeNode('example'))
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('removeAttributeNode(document.createAttribute())', () => {
        const test = new ElementAssembler()
        const node = test.node
        const attrNode = document.createAttribute('foobar')
        node.setAttributeNode(attrNode)
        const removedAttr = test.removeAttributeNode(attrNode)
        it('nodes equal', () => {
            assert.equal(removedAttr.node, attrNode)
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 0)
        })
        it('node.hasAttribute()', () => {
            assert.isFalse(node.hasAttribute('foobar'))
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('removeAttributeNode(AttrAssembler)', () => {
        const test = new ElementAssembler
        const node = test.node
        const attrNode = document.createAttribute('attr')
        node.setAttributeNode(attrNode)
        const removedAttr = test.removeAttributeNode(AttrAssembler)
        it('nodes equal', () => {
            assert.equal(removedAttr.node, attrNode)
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.hasAttribute()', () => {
            assert.isFalse(node.hasAttribute('attr'))
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('removeAttributeNode(class extends AttrAssembler)', () => {
        const test = new ElementAssembler
        const node = test.node
        node.setAttribute('foo', 'bar')
        class Foo extends AttrAssembler {}
        const removedAttr = test.removeAttributeNode(Foo)
        it('instanceof', () => {
            assert.instanceOf(removedAttr, Foo)
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.hasAttribute()', () => {
            assert.isFalse(node.hasAttribute('foo'))
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('removeAttributeNode(new String)', () => {
        const test = new ElementAssembler()
        const node = test.node
        const attrNode = document.createAttribute('foobar')
        node.setAttributeNode(attrNode)
        const removedAttr = test.removeAttributeNode('foobar')
        it('nodes equal', () => {
            assert.equal(removedAttr.node, attrNode)
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 0)
        })
        it('node.hasAttribute()', () => {
            assert.isFalse(node.hasAttribute('attr'))
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('setAttribute(AttrAssembler, new String)', () => {
        const test = new ElementAssembler
        const node = test.node
        test.setAttribute(AttrAssembler, 'foobar')
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 1)
        })
        it('node.hasAttribute()', () => {
            assert(node.hasAttribute(AttrAssembler.localName), 'node.hasAttribute()')
        })
        it('node.getAttribute()', () => {
            assert.equal(node.getAttribute(AttrAssembler.localName), 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element attr="foobar"/>')
        })
    })
    describe('setAttribute(new String, new String)', () => {
        const test = new ElementAssembler
        const node = test.node
        test.setAttribute('foo', 'bar')
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('node.attributes.length', () => {
            assert.lengthOf(node.attributes, 1)
        })
        it('node.hasAttribute()', () => {
            assert(node.hasAttribute('foo'), 'node.hasAttribute()')
        })
        it('node.value', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
    describe('on(new String, handler)', () => {
        const test = new ElementAssembler
        const handler = sinon.spy()
        test.on('foobar', handler)
        it('handler.notCalled', () => {
            assert(handler.notCalled, 'hanlder.notCalled')
        })
        it('emit(new String) => handler.calledOnce', () => {
            test.emit('foobar')
            assert(handler.calledOnce, 'handler.calledOnce')
        })
        it('un(new String, hanlder); emit(new String) => handler.calledOnce', () => {
            test.un('foobar', handler)
            test.emit('foobar')
            assert(handler.calledOnce, 'handler.calledOnce')
        })
    })
    describe('id', () => {
        const test = new ElementAssembler({ id : 'foobar' })
        it('id', () => {
            assert.equal(test.id, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element id="foobar"/>')
        })
    })
    describe('className', () => {
        const test = new ElementAssembler({ className : 'foo bar' })
        it('className', () => {
            assert.equal(test.className, 'foo bar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element class="foo bar"/>')
        })
    })
    describe('classList = new Array', () => {
        const test = new ElementAssembler
        test.classList = ['foo', 'bar']
        it('className', () => {
            assert.equal(test.className, 'foo bar')
        })
        it('classList', () => {
            assert.instanceOf(test.classList, window.DOMTokenList)
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
            assert(test.classList.contains('bar'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element class="foo bar"/>')
        })
    })
    describe('classList = new Object', () => {
        const test = new ElementAssembler
        test.classList = { foo : true, bar : false, wiz : true }
        it('className', () => {
            assert.equal(test.className, 'foo wiz')
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
            assert(test.classList.contains('wiz'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element class="foo wiz"/>')
        })
    })
    describe('classList = new String', () => {
        const test = new ElementAssembler({ className : 'foo' })
        test.classList = 'bar'
        it('className', () => {
            assert.equal(test.className, 'foo bar')
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
            assert(test.classList.contains('bar'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element class="foo bar"/>')
        })
    })
    describe('classList = false', () => {
        const test = new ElementAssembler({ className : 'foo' })
        test.classList = false
        it('className', () => {
            assert.equal(test.className, 'foo')
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element class="foo"/>')
        })
    })
    describe('class extends ElementAssembler', () => {
        class Bar extends ElementAssembler {
            static get namespaceURI() {
                return 'http://example.com/ns'
            }
            static get prefix() {
                return 'foo'
            }
        }
        const test = new Bar
        it('node.namespaceURI', () => {
            assert.equal(test.node.namespaceURI, 'http://example.com/ns')
        })
        it('node.tagName', () => {
            assert.equal(test.node.tagName, Bar.qualifiedName)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<foo:bar xmlns:foo="http://example.com/ns"/>')
        })
    })
    describe('element(element(), element(), element())', () => {
        let foo, bar, wiz
        const test = element([
            foo = element('foo'),
            bar = element('bar'),
            wiz = element('wiz')
        ])
        it('firstElementChild', () => {
            assert.equal(test.firstElementChild, foo)
        })
        it('lastElementChild', () => {
            assert.equal(test.lastElementChild, wiz)
        })
        it('elementIndex', () => {
            assert.equal(foo.elementIndex, 0)
            assert.equal(bar.elementIndex, 1)
            assert.equal(wiz.elementIndex, 2)
        })
        it('nextElementSibling', () => {
            assert.equal(foo.nextElementSibling, bar)
            assert.equal(bar.nextElementSibling, wiz)
            assert.isNull(wiz.nextElementSibling)
        })
        it('previousElementSibling', () => {
            assert.isNull(foo.previousElementSibling)
            assert.equal(bar.previousElementSibling, foo)
            assert.equal(wiz.previousElementSibling, bar)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element>' +
                '<element>foo</element>' +
                '<element>bar</element>' +
                '<element>wiz</element>' +
                '</element>'
            assert.equal(xml, sample)
        })
        it('removeChild(child); childNodes.length; elementIndex', () => {
            test.removeChild(bar)
            assert.equal(test.childNodes.length, 2)
            assert.equal(bar.elementIndex, -1)
            assert.equal(wiz.elementIndex, 1)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element>' +
                '<element>foo</element>' +
                '<element>wiz</element>' +
                '</element>'
            assert.equal(xml, sample)
        })
    })
    describe('element({ parentNode : new DocumentAssembler })', () => {
        const doc = new DocumentAssembler
        const test = element({ parentNode : doc })
        it('parentNode', () => {
            assert.equal(test.parentNode, doc)
        })
        it('serializeToString(doc.node)', () => {
            assert.equal(serializer.serializeToString(doc.node), '<element/>')
        })
    })
    describe('element({ attrset })', () => {
        const test = element({ attrset : { foo : 'bar', cux : 'wiz' } })
        const attrset = test.attrset
        it('attributes.length', () => {
            assert.equal(test.attributes.length, 2)
        })
        it('hasAttribute()', () => {
            assert(test.hasAttribute('foo'), 'hasAttribute("foo")')
            assert(test.hasAttribute('cux'), 'hasAttribute("cux")')
        })
        it('getAttribute()', () => {
            assert.equal(test.getAttribute('foo'), 'bar')
            assert.equal(test.getAttribute('cux'), 'wiz')
        })
        it('attrset', () => {
            assert.equal(attrset.foo, 'bar')
            assert.equal(attrset.cux, 'wiz')
        })
    })
    describe('element({ attributes : new Array })', () => {
        let foo, wiz
        const test = element({
            attributes : [
                foo = new AttrAssembler({ name : 'foo', value : 'bar' }),
                wiz = document.createAttribute('wiz')
            ]
        })
        const attributes = test.attributes
        it('attributes.length', () => {
            assert.equal(test.attributes.length, 2)
        })
        it('hasAttribute()', () => {
            assert(test.hasAttribute('foo'), 'hasAttribute("foo")')
            assert(test.hasAttribute('wiz'), 'hasAttribute("wiz")')
        })
        it('getAttribute()', () => {
            assert.equal(test.getAttribute('foo'), 'bar')
            assert.equal(test.getAttribute('wiz'), '')
        })
        it('attributes', () => {
            assert.equal(attributes[0], foo)
            assert.equal(attributes[1].node, wiz)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element foo="bar" wiz=""/>'
            assert.equal(xml, sample)
        })
        it('setAttributeNode(new AttrAssembler)', () => {
            const attr = new AttrAssembler({
                name : 'foo',
                value : 'test'
            })
            test.setAttributeNode(attr)
            it('attributes', () => {
                assert.equal(attributes.length, 2)
                assert.equal(attributes[0], attr)
            })
            it('getAttribute', () => {
                assert.equal(test.getAttribute('foo'), 'test')
            })
        })
    })
    describe('setAttributeNode(new AttrAssembler({ namespaceURI }))', () => {
        const test = new ElementAssembler
        const attr = new AttrAssembler({
            namespaceURI : 'http://example.com/ns',
            name : 'foo:bar',
            value : 'test'
        })
        test.setAttributeNode(attr)
        it('attributes', () => {
            assert.equal(test.attributes.length, 1)
            assert.equal(test.attributes[0], attr)
        })
        it('node.getAttributeNS', () => {
            assert.equal(test.node.getAttributeNS('http://example.com/ns', 'bar'), 'test')
        })
    })
    describe('setAttributeNode(document.createAttributeNS())', () => {
        const test = new ElementAssembler
        const attrNode = document.createAttributeNS('http://example.com/ns', 'foo:bar')
        test.setAttributeNode(attrNode)
        it('attributes', () => {
            assert.equal(test.attributes.length, 1)
            assert.equal(test.attributes[0].node, attrNode)
        })
        it('node.getAttributeNS', () => {
            assert.equal(test.node.getAttributeNS('http://example.com/ns', 'bar'), '')
        })
    })
    describe('element({ attributes : document.createAttribute() })', () => {
        const foobar = document.createAttribute('foobar')
        const test = element({ attributes : foobar })
        const attributes = test.attributes
        it('attributes.length', () => {
            assert.equal(test.attributes.length, 1)
        })
        it('hasAttribute()', () => {
            assert(test.hasAttribute('foobar'), 'hasAttribute()')
        })
        it('getAttribute()', () => {
            assert.equal(test.getAttribute('foobar'), '')
        })
        it('attributes', () => {
            assert.equal(attributes[0].node, foobar)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element foobar=""/>'
            assert.equal(xml, sample)
        })
    })
    describe('children', () => {
        let foo, bar, wiz
        const test = element({
            children : [
                foo = document.createElementNS('', 'foo'),
                bar = element({ localName : 'bar' }),
                wiz = document.createElementNS('', 'wiz'),
            ]
        })
        const children = test.children
        it('children.length', () => {
            assert.equal(children.length, 3)
        })
        it('children[*].instanceof', () => {
            assert.instanceOf(children[0], ElementAssembler)
            assert.instanceOf(children[1], ElementAssembler)
            assert.instanceOf(children[2], ElementAssembler)
        })
        it('children[*]', () => {
            assert.equal(children[0].node, foo)
            assert.equal(children[1], bar)
            assert.equal(children[2].node, wiz)
        })
        it('serializeToString(node)', () => {
            const sample = '<element><foo/><bar/><wiz/></element>'
            assert.equal(serializer.serializeToString(test.node), sample)
        })
    })
})
