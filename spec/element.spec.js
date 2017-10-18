import chai from 'chai'
import { ElementAssembler, AttrAssembler } from '../lib/'

const { assert } = chai
const { Element } = window

const serializer = new XMLSerializer

describe('ElementAssembler', () => {
    describe('new ElementAssembler', () => {
        const instance = new ElementAssembler
        const node = instance.node
        it('Created node has proper inheritance', () => {
            assert(node instanceof Element, node + ' instance of ' + Element)
        })
        it('Created node has proper constructor', () => {
            assert.equal(node.constructor, Element)
        })
        it('Created node has proper tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('Created node has proper number of attributes', () => {
            assert(!node.hasAttributes(), 'has no attributes')
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    describe('getAttributeNode(new String)', () => {
        const instance = new ElementAssembler
        const node = instance.node
        node.setAttribute('foo', 'bar')
        const attr = instance.getAttributeNode('foo')
        it('Returned node has proper inheritance', () => {
            assert(attr instanceof AttrAssembler, 'proper inheritance')
        })
        it('Returned node has proper localName', () => {
            assert.equal(attr.node.localName, 'foo')
        })
        it('Returned node has proper value', () => {
            assert.equal(attr.node.value, 'bar')
        })
    })
    describe('getAttributeNode(AttrAssembler)', () => {
        const instance = new ElementAssembler
        const node = instance.node
        node.setAttribute(AttrAssembler.localName, 'foobar')
        const attr = instance.getAttributeNode(AttrAssembler)
        it('Returned node has proper inheritance', () => {
            assert(attr instanceof AttrAssembler, 'proper inheritance')
        })
        it('Returned node has proper localName', () => {
            assert.equal(attr.node.localName, AttrAssembler.localName)
        })
        it('Returned node has proper value', () => {
            assert.equal(attr.node.value, 'foobar')
        })
    })
    describe('setAttributeNode(document.createAttribute())', () => {
        const instance = new ElementAssembler
        const node = instance.node
        const attr = document.createAttribute('foo')
        attr.value = 'bar'
        instance.setAttributeNode(attr)
        it('Created node has proper number of attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('Created node has assigned attribute', () => {
            assert(node.hasAttribute('foo'), 'has attribute')
        })
        it('Created node has proper attribute value', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
    describe('setAttributeNode(new AttrAssembler())', () => {
        const instance = new ElementAssembler
        const node = instance.node
        const attr = new AttrAssembler({ name : 'foo', value : 'bar' })
        instance.setAttributeNode(attr)
        it('Created node has proper number of attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('Created node has assigned attribute', () => {
            assert(node.hasAttribute('foo'), 'has attribute')
        })
        it('Created node has proper attribute value', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
    describe('setAttribute(AttrAssembler, new String)', () => {
        const instance = new ElementAssembler
        const node = instance.node
        instance.setAttribute(AttrAssembler, 'foobar')
        it('Created node has proper number of attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('Created node has assigned attribute', () => {
            assert(node.hasAttribute(AttrAssembler.localName), 'has attribute')
        })
        it('Created node has proper attribute value', () => {
            assert.equal(node.getAttribute(AttrAssembler.localName), 'foobar')
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node), '<element attr="foobar"/>')
        })
    })
    describe('setAttribute(new String, new String)', () => {
        const instance = new ElementAssembler
        const node = instance.node
        instance.setAttribute('foo', 'bar')
        it('Created node has proper number of attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('Created node has assigned attribute', () => {
            assert(node.hasAttribute('foo'), 'has attribute')
        })
        it('Created node has proper attribute value', () => {
            assert.equal(node.getAttribute('foo'), 'bar')
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node), '<element foo="bar"/>')
        })
    })
})
