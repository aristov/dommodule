import chai from 'chai'
import {
    // ElementAssembler, TextAssembler,
    comment, element, instruction, text
} from '../lib'

const { assert } = chai
const { XMLSerializer } = window
const serializer = new XMLSerializer

describe('ChildNodeAssembler', () => {
    describe('remove(), parentNode', () => {
        const test = element()
        test.remove()
        it('parentNode', () => {
            assert.isNull(test.parentNode)
        })
    })
    describe('parentElement', () => {
        const parentElement = element()
        const test = element({ parentElement })
        it('parentElement', () => {
            assert.equal(test.parentElement, parentElement)
        })
        it('parentElement.firstChild', () => {
            assert.equal(parentElement.firstChild, test)
        })
    })
    /*describe('after', () => { // todo jsdom
        const ctx = element()
        const test = element(ctx)
        const foo = text('foo')
        ctx.after(foo, 'bar')
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 3)
        })
        it('firstChild', () => {
            assert.instanceOf(test.firstChild, ElementAssembler)
            assert.equal(test.firstChild, ctx)
        })
        it('lastChild', () => {
            assert.instanceOf(test.lastChild, TextAssembler)
            assert.equal(test.lastChild.data, 'bar')
        })
        it('childNodes[1]', () => {
            const child = test.childNodes[1]
            assert.instanceOf(child, TextAssembler)
            assert.equal(child, foo)
            assert.equal(child.data, 'foo')
        })
    })
    describe('before', () => { // todo jsdom
        const ctx = element()
        const test = element(ctx)
        const foo = text('foo')
        ctx.before(foo, 'bar')
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 3)
        })
        it('firstChild', () => {
            assert.instanceOf(test.firstChild, TextAssembler)
            assert.equal(test.firstChild, foo)
            assert.equal(test.firstChild.data, 'foo')
        })
        it('lastChild', () => {
            assert.instanceOf(test.lastChild, ElementAssembler)
            assert.equal(test.lastChild, ctx)
        })
        it('childNodes[1]', () => {
            assert.instanceOf(test.childNodes[1], TextAssembler)
            assert.equal(test.childNodes[1].data, 'bar')
        })
    })
    describe('replaceWith', () => { // todo jsdom
        const ctx = element()
        const test = element(ctx)
        const foo = text('foo')
        ctx.replaceWith(foo)
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 1)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, foo)
        })
        it('not contains replaced element', () => {
            assert.isFalse(test.contains(ctx))
        })
        it('contains inseted text', () => {
            assert(test.contains(foo), 'contains inseted text')
        })
    })*/
    describe('remove()', () => {
        let $element
        const test = element([
            text('foobar'),
            comment('example'),
            $element = element(),
            instruction('test')
        ])
        const node = test.node
        $element.remove()
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 3)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(node)
            const sample = '<element>foobar<!--example--><?instruction test?></element>'
            assert.equal(xml, sample)
        })
    })
})
