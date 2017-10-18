import chai from 'chai'
import { AttrAssembler } from '../lib/'

const { assert } = chai
const { Attr } = window

describe('AttrAssembler', () => {
    describe('new AttrAssembler', () => {
        const instance = new AttrAssembler
        const node = instance.node
        it('instanceof Attr', () => {
            assert(node instanceof Attr, 'instanceof Attr')
        })
        it('name', () => {
            assert.equal(node.name, 'attr')
        })
        it('value', () => {
            assert.equal(node.value, '')
        })
    })
    describe('new AttrAssembler(new String)', () => {
        const instance = new AttrAssembler('foobar')
        const node = instance.node
        it('name', () => {
            assert.equal(node.name, 'attr')
        })
        it('value', () => {
            assert.equal(node.value, 'foobar')
        })
    })
    describe('new AttrAssembler({ name, value })', () => {
        const instance = new AttrAssembler({ name : 'foo', value : 'bar' })
        const node = instance.node
        it('name', () => {
            assert.equal(node.name, 'foo')
        })
        it('value', () => {
            assert.equal(node.value, 'bar')
        })
    })
    describe('new AttrAssembler({ node })', () => {
        const node = document.createAttribute('foo')
        node.value = 'bar'
        const instance = new AttrAssembler({ node })
        const attr = instance.node
        it('node equal', () => {
            assert.equal(attr, node)
        })
        it('name', () => {
            assert.equal(attr.name, 'foo')
        })
        it('value', () => {
            assert.equal(attr.value, 'bar')
        })
    })
    describe('new AttrAssembler({ namespaceURI, prefix, localName })', () => {
        const instance = new AttrAssembler({
            namespaceURI : 'http://www.w3.org/XML/1998/namespace',
            prefix : 'xml',
            localName : 'id',
            value : 'foobar'
        })
        const node = instance.node
        it('namespaceURI', () => {
            assert.equal(node.namespaceURI, 'http://www.w3.org/XML/1998/namespace')
        })
        it('prefix, localName, name', () => {
            assert.equal(node.prefix, 'xml')
            assert.equal(node.localName, 'id')
            assert.equal(node.name, 'xml:id')
        })
        it('value', () => {
            assert.equal(node.value, 'foobar')
        })
    })
})
