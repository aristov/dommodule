import chai from 'chai'
import { ElementAssembler, TextAssembler, AttrAssembler, CommentAssembler } from '../lib'

let undefined

const { assert } = chai
const { XMLSerializer } = window
const serializer = new XMLSerializer

function serialize({ node }) {
    return serializer.serializeToString(node)
}

class Parent extends ElementAssembler {}
class Child extends ElementAssembler {}
class Prev extends ElementAssembler {}
class Next extends ElementAssembler {}
class A1 extends AttrAssembler {}
class OE1 extends ElementAssembler {}
class E1 extends ElementAssembler {}
class E2 extends ElementAssembler {}

let parent, child, prev, next, children

beforeEach(() => parent = child = prev = next = children = undefined)

describe('ChildNodeAssembler', () => {
    describe('before, after, replaceWith', () => {
        beforeEach(() => {
            parent = new Parent([new Prev, child = new Child, new Next])
            children = [
                'ts1',
                0,
                new E1,
                null,
                new A1({ ownerElement : new OE1 }),
                [
                    42,
                    new CommentAssembler('c1'),
                    new TextAssembler('t1'),
                    false,
                    new E2,
                    'ts2',
                    [new CommentAssembler('c2'), undefined, new TextAssembler('t2')]
                ]
            ]
        })
        it('before', () => {
            child.before(...children)
            assert.equal(serialize(parent),
                '<Parent><Prev/>ts1<E1/><OE1 a1=""/>42<!--c1-->t1<E2/>ts2<!--c2-->t2<Child/><Next/></Parent>')
        })
        it('after', () => {
            child.after(...children)
            assert.equal(serialize(parent),
                '<Parent><Prev/><Child/>ts1<E1/><OE1 a1=""/>42<!--c1-->t1<E2/>ts2<!--c2-->t2<Next/></Parent>')
        })
        it('replaceWith', () => {
            child.replaceWith(...children)
            assert.equal(serialize(parent),
                '<Parent><Prev/>ts1<E1/><OE1 a1=""/>42<!--c1-->t1<E2/>ts2<!--c2-->t2<Next/></Parent>')
        })
    })
    describe('parentNode, parentElement, remove, nextSibling, previousSibling', () => {
        it('parentNode, parentElement', () => {
            child = new Child({ parentNode : parent = new Parent })
            assert.equal(child.parentNode, parent)
            assert.equal(child.parentElement, parent)
            assert.lengthOf(parent.children, 1)
            assert.equal(parent.firstChild, child)
            assert.equal(parent.lastChild, child)
            assert.equal(serialize(parent), '<Parent><Child/></Parent>')
        })
        it('parentNode = null', () => {
            parent = new Parent(child = new Child)
            child.parentNode = null
            assert.lengthOf(parent.children, 0)
            assert.isNull(child.parentNode)
            assert.equal(serialize(parent), '<Parent/>')
        })
        it('remove', () => {
            parent = new Parent(child = new Child)
            child.remove()
            assert.lengthOf(parent.children, 0)
            assert.isNull(child.parentNode)
            assert.equal(serialize(parent), '<Parent/>')
        })
        it('set not appended nextSibling of appended element', () => {
            parent = new Parent(prev = new Prev)
            prev.nextSibling = next = new Next
            assert.lengthOf(parent.children, 2)
            assert.equal(parent.firstChild, prev)
            assert.equal(parent.lastChild, next)
            assert.equal(prev.nextSibling, next)
            assert.equal(serialize(parent), '<Parent><Prev/><Next/></Parent>')
        })
        it('set appended nextSibling of not appended element', () => {
            parent = new Parent(next = new Next)
            prev = new Prev({ nextSibling : next })
            assert.lengthOf(parent.children, 2)
            assert.equal(parent.firstChild, prev)
            assert.equal(parent.lastChild, next)
            assert.equal(prev.nextSibling, next)
            assert.equal(serialize(parent), '<Parent><Prev/><Next/></Parent>')
        })
        it('set not appended previousSibling of appended element', () => {
            parent = new Parent(next = new Next)
            next.previousSibling = prev = new Prev
            assert.lengthOf(parent.children, 2)
            assert.equal(parent.firstChild, prev)
            assert.equal(parent.lastChild, next)
            assert.equal(prev.nextSibling, next)
            assert.equal(serialize(parent), '<Parent><Prev/><Next/></Parent>')
        })
        it('set appended previousSibling of not appended element', () => {
            parent = new Parent(prev = new Prev)
            next = new Next({ previousSibling : prev })
            assert.lengthOf(parent.children, 2)
            assert.equal(parent.firstChild, prev)
            assert.equal(parent.lastChild, next)
            assert.equal(prev.nextSibling, next)
            assert.equal(serialize(parent), '<Parent><Prev/><Next/></Parent>')
        })
        it('set not appended nextSibling of not appended element', () => {
            parent = new Parent(prev = new Prev({
                nextSibling : next = new Next
            }))
            assert.lengthOf(parent.children, 2)
            assert.equal(parent.firstChild, prev)
            assert.equal(parent.lastChild, next)
            assert.equal(prev.nextSibling, next)
            assert.equal(serialize(parent), '<Parent><Prev/><Next/></Parent>')
        })
        it('set not appended previousSibling of not appended element', () => {
            parent = new Parent(next = new Next({
                previousSibling : prev = new Prev
            }))
            assert.lengthOf(parent.children, 2)
            assert.equal(parent.firstChild, prev)
            assert.equal(parent.lastChild, next)
            assert.equal(next.previousSibling, prev)
            assert.equal(serialize(parent), '<Parent><Prev/><Next/></Parent>')
        })
    })
})
