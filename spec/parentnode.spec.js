import chai from 'chai'
import {
    ElementAssembler,
    TextAssembler,
    CommentAssembler,
    AttrAssembler,
    element
} from '../lib'

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
            const sample = /^<element><element class="new" ?\/><element class="old" ?\/><\/element>$/
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
            const sample = /^<element><element class="new" ?\/><element class="old" ?\/><\/element>$/
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
            const sample = /^<element><element class="new" ?\/><\/element>$/
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
            const sample = /^<element><element class="new" ?\/><\/element>$/
            assert.match(serializer.serializeToString(test.node), sample)
        })
    })
    describe.skip('find, findAll', () => {
        let test, e1, e2, e3, a1, a2, a3, t1, t2, t3, c1, c2, c3
        beforeEach(() => {
            test = new ElementAssembler([
                e1 = new ElementAssembler({
                    attributes : a1 = new AttrAssembler('a1'),
                    childNodes : [
                        t2 = new TextAssembler('t1'),
                        e2 = new ElementAssembler({
                            attributes : a2 = new AttrAssembler('a2'),
                            childNodes : [
                                c3 = new CommentAssembler('c3'),
                                t3 = new TextAssembler('t3'),
                                e3 = new ElementAssembler({
                                    attributes : a3 = new AttrAssembler('a3')
                                })
                            ]
                        }),
                        c2 = new CommentAssembler('c2')
                    ]
                }),
                t1 = new TextAssembler('t1'),
                c1 = new CommentAssembler('c1')
            ])
        })
        it('find(new String)', () => {
            assert.equal(test.find('element'), e1)
        })
        it('find(ElementAssembler)', () => {
            assert.equal(test.find(ElementAssembler), e1)
        })
        it('find(AttrAssembler)', () => {
            assert.equal(test.find(AttrAssembler), a1)
        })
        it('find(TextAssembler)', () => {
            assert.equal(test.find(TextAssembler), t1)
        })
        it('find(CommentAssembler)', () => {
            assert.equal(test.find(CommentAssembler), c1)
        })
        it('findAll(new String)', () => {
            const result = test.findAll('element')
            assert.lengthOf(result, 3)
            assert.equal(result[0], e1)
            assert.equal(result[1], e2)
            assert.equal(result[2], e3)
        })
        it('findAll(ElementAssembler)', () => {
            const result = test.findAll(ElementAssembler)
            assert.lengthOf(result, 3)
            assert.equal(result[0], e1)
            assert.equal(result[1], e2)
            assert.equal(result[2], e3)
        })
        it('findAll(AttrAssembler)', () => {
            const result = test.findAll(AttrAssembler)
            assert.lengthOf(result, 3)
            assert.equal(result[0], a1)
            assert.equal(result[1], a2)
            assert.equal(result[2], a3)
        })
        it('findAll(TextAssembler)', () => {
            const result = test.findAll(TextAssembler)
            assert.lengthOf(result, 3)
            assert.equal(result[0], t1)
            assert.equal(result[1], t2)
            assert.equal(result[2], t3)
        })
        it('findAll(CommentAssembler)', () => {
            const result = test.findAll(CommentAssembler)
            assert.lengthOf(result, 3)
            assert.equal(result[0], c1)
            assert.equal(result[1], c2)
            assert.equal(result[2], c3)
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
