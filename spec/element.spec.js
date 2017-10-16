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
    describe('setAttribute(AttrAssembler, "...")', () => {
        const instance = new ElementAssembler
        const node = instance.node
        const value = 'test attr value'
        instance.setAttribute(AttrAssembler, value)
        it('Created node has assigned attribute', () => {
            assert(node.hasAttribute(AttrAssembler.localName), 'has attribute')
        })
        it('Created node has proper number of attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('Created node has proper attribute value', () => {
            assert.equal(node.getAttribute(AttrAssembler.localName), value)
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node),
                '<element attr="test attr value"/>')
        })
    })
    describe.skip('setAttribute("...", "...")', () => {
        const instance = new ElementAssembler
        const node = instance.node
        const name = 'attrname'
        const value = 'test attr value'
        instance.setAttribute(name, value)
        it('Created node has assigned attribute', () => {
            assert(node.hasAttribute(name), 'has attribute')
        })
        it('Created node has proper number of attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('Created node has proper attribute value', () => {
            assert.equal(node.getAttribute(name), value)
        })
        it('Created node is properly serialized', () => {
            assert.equal(serializer.serializeToString(node),
                '<element attr-name="test attr value"/>')
        })
    })
})
