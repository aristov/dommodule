import chai from 'chai'
import {
    AttrAssembler,
    Element, ElementAssembler,
    Text, TextAssembler
} from '../lib'

const { assert } = chai
const { sinon } = window

const serializer = new XMLSerializer

describe('ElementAssembler', () => {
    describe('new ElementAssembler', () => {
        const element = new ElementAssembler
        const node = element.node
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
        const element = new ElementAssembler({ localName : 'foobar' })
        const node = element.node
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
        const element = new ElementAssembler({ qualifiedName : 'foobar' })
        const node = element.node
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
        const element = new ElementAssembler({
            namespaceURI : 'http://example.com/namespace',
            prefix : 'foo',
            localName : 'bar'
        })
        const node = element.node
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
        const element = new ElementAssembler({
            namespaceURI : 'http://example.com/namespace',
            qualifiedName : 'foo:bar'
        })
        const node = element.node
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
        const element = new ElementAssembler({ node : foobar })
        const node = element.node
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
        const element = new ElementAssembler(child)
        const node = element.node
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
        const element = new ElementAssembler(childNode)
        const node = element.node
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
        const element = new ElementAssembler(text)
        const node = element.node
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
        const element = new ElementAssembler(textNode)
        const node = element.node
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
        const element = new ElementAssembler(textContent)
        const node = element.node
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
        const element = new ElementAssembler
        const node = element.node
        node.setAttribute('foo', 'bar')
        const attr = element.getAttributeNode('foo')
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
        const element = new ElementAssembler
        const node = element.node
        node.setAttribute(AttrAssembler.localName, 'foobar')
        const attr = element.getAttributeNode(AttrAssembler)
        it('instanceof AttrAssembler', () => {
            assert.instanceOf(attr, AttrAssembler)
        })
        it('node.localName', () => {
            assert.equal(attr.node.localName, AttrAssembler.localName)
        })
        it('node.value', () => {
            assert.equal(attr.node.value, 'foobar')
        })
    })
    describe('setAttributeNode(document.createAttribute())', () => {
        const element = new ElementAssembler
        const node = element.node
        const attrNode = document.createAttribute('foo')
        attrNode.value = 'bar'
        element.setAttributeNode(attrNode)
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
        const element = new ElementAssembler
        const node = element.node
        const attr = new AttrAssembler({ name : 'foo', value : 'bar' })
        element.setAttributeNode(attr)
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
    describe('removeAttributeNode(new AttrAssembler)', () => {
        const element = new ElementAssembler()
        const node = element.node
        const attr = new AttrAssembler('foobar')
        element.setAttributeNode(attr)
        const removedAttr = element.removeAttributeNode(attr)
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
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('removeAttributeNode(document.createAttribute())', () => {
        const element = new ElementAssembler()
        const node = element.node
        const attrNode = document.createAttribute('foobar')
        node.setAttributeNode(attrNode)
        const removedAttr = element.removeAttributeNode(attrNode)
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
        const element = new ElementAssembler()
        const node = element.node
        const attrNode = document.createAttribute('attr')
        node.setAttributeNode(attrNode)
        const removedAttr = element.removeAttributeNode(AttrAssembler)
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
    describe('removeAttributeNode(new String)', () => {
        const element = new ElementAssembler()
        const node = element.node
        const attrNode = document.createAttribute('foobar')
        node.setAttributeNode(attrNode)
        const removedAttr = element.removeAttributeNode('foobar')
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
        const element = new ElementAssembler
        const node = element.node
        element.setAttribute(AttrAssembler, 'foobar')
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
        const element = new ElementAssembler
        const node = element.node
        element.setAttribute('foo', 'bar')
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
        const element = new ElementAssembler
        const handler = sinon.spy()
        element.on('foobar', handler)
        it('handler.notCalled', () => {
            assert(handler.notCalled, 'hanlder.notCalled')
        })
        it('emit(new String) => handler.calledOnce', () => {
            element.emit('foobar')
            assert(handler.calledOnce, 'handler.calledOnce')
        })
        it('un(new String, hanlder); emit(new String) => handler.calledOnce', () => {
            element.un('foobar', handler)
            element.emit('foobar')
            assert(handler.calledOnce, 'handler.calledOnce')
        })
    })
})
