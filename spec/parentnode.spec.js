import chai from 'chai'
import { element } from '../lib'

const { assert } = chai
const { XMLSerializer } = window
const serializer = new XMLSerializer

describe('ParentNodeAssembler', () => {
    describe('insertBefore(instance, node)', () => {
        const child = element({ className : 'old' })
        const test = element(child)
        const newChild = element({ className : 'new' })
        test.insertBefore(newChild, child.node)
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 2)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, newChild)
        })
        it('lastChild', () => {
            assert.equal(test.lastChild, child)
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><element class="new"\s?\/><element class="old"\s?\/><\/element>$/
            assert.match(serializer.serializeToString(test.node), sample)
        })
    })
    describe('insertBefore(node, instance)', () => {
        const child = element({ className : 'old' })
        const test = element(child)
        const newChild = element({ className : 'new' })
        test.insertBefore(newChild.node, child)
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 2)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, newChild)
        })
        it('lastChild', () => {
            assert.equal(test.lastChild, child)
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><element class="new"\s?\/><element class="old"\s?\/><\/element>$/
            assert.match(serializer.serializeToString(test.node), sample)
        })
    })
    describe('replaceChild(instance, node)', () => {
        const child = element({ className : 'old' })
        const test = element(child)
        const newChild = element({ className : 'new' })
        test.replaceChild(newChild, child.node)
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 1)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, newChild)
        })
        it('contains', () => {
            assert.isFalse(test.contains(child))
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><element class="new"\s?\/><\/element>$/
            assert.match(serializer.serializeToString(test.node), sample)
        })
    })
    describe('replaceChild(node, instance)', () => {
        const child = element({ className : 'old' })
        const test = element(child)
        const newChild = element({ className : 'new' })
        test.replaceChild(newChild.node, child)
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 1)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, newChild)
        })
        it('contains', () => {
            assert.isFalse(test.contains(child))
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><element class="new"\s?\/><\/element>$/
            assert.match(serializer.serializeToString(test.node), sample)
        })
    })
    /*describe('prepend', () => { // todo jsdom
        const textNode = document.createTextNode('bar')
        const test = element(textNode)
        const textInstance = new TextAssembler('foo')
        const child = element()
        test.prepend(textInstance, child)
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 3)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, textInstance)
        })
        it('firstElementChild', () => {
            assert.equal(test.firstElementChild, child)
        })
        it('lastChild.node', () => {
            assert.equal(test.lastChild.node, textNode)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foo<element/>bar</element>'
            assert.equal(serializer.serializeToString(test.node), sample)
        })
    })*/
})
