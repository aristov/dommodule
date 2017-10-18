import chai from 'chai'
import { ElementAssembler, AttrAssembler } from '../lib/'

const { assert } = chai
const { Element, Attr } = window

describe('AttrAssembler', () => {
    describe('new AttrAssembler', () => {
        const instance = new AttrAssembler
        const node = instance.node
        it('Created node has proper inheritance', () => {
            assert(node instanceof Attr, 'instanceof Attr')
        })
        it('Created node has proper name', () => {
            assert.equal(node.name, 'attr')
        })
        it('Created node has no value', () => {
            assert.equal(node.value, '')
        })
    })
    describe('new AttrAssembler({ name, value })', () => {
        const instance = new AttrAssembler({ name : 'foo', value : 'bar' })
        const node = instance.node
        it('Created node has proper name', () => {
            assert.equal(node.name, 'foo')
        })
        it('Created node has proper value', () => {
            assert.equal(node.value, 'bar')
        })
    })
    describe('new AttrAssembler(new String)', () => {
        const instance = new AttrAssembler('foobar')
        const node = instance.node
        it('Created node has proper name', () => {
            assert.equal(node.name, 'attr')
        })
        it('Created node has proper value', () => {
            assert.equal(node.value, 'foobar')
        })
    })
})
