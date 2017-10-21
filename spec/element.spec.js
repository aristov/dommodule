import chai from 'chai'
import { Element, ElementAssembler, AttrAssembler } from '../lib/'

const { assert } = chai

const serializer = new XMLSerializer

describe('ElementAssembler', () => {
    describe('new ElementAssembler', () => {
        const element = new ElementAssembler
        const node = element.node
        it('instanceof Element', () => {
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
        const removedInstance = element.removeAttributeNode(attrNode)
        it('nodes equal', () => {
            assert.equal(removedInstance.node, attrNode)
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
        const removedInstance = element.removeAttributeNode(AttrAssembler)
        it('nodes equal', () => {
            assert.equal(removedInstance.node, attrNode)
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
        const removedInstance = element.removeAttributeNode('foobar')
        it('nodes equal', () => {
            assert.equal(removedInstance.node, attrNode)
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
            assert(node.hasAttribute(AttrAssembler.localName), 'has attribute')
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
            assert(node.hasAttribute('foo'), 'has attribute')
        })
        it('node.value', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('serializeToString(node)', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
})
