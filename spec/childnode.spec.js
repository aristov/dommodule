import chai from 'chai'
import {
    ElementAssembler, TextAssembler,
    comment, text, AttrAssembler, CommentAssembler
} from '../lib'

const { assert } = chai
const { XMLSerializer } = window
const serializer = new XMLSerializer

class TestElement extends ElementAssembler {
    static get localName() {
        return 'element'
    }
}

describe('ChildNodeAssembler', () => {
    describe('remove(), parentNode', () => {
        const test = new TestElement()
        test.remove()
        it('parentNode', () => {
            assert.isNull(test.parentNode)
        })
    })
    describe('parentNode', () => {
        const parentNode = new TestElement()
        const test = new TestElement({ parentNode })
        it('parentNode', () => {
            assert.equal(test.parentNode, parentNode)
        })
        it('parentNode.firstChild', () => {
            assert.equal(parentNode.firstChild, test)
        })
    })
    describe('after', () => {
        const ctx = new TestElement()
        const test = new TestElement(ctx)
        const foo = new TextAssembler('foo')
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
    describe('before', () => {
        const ctx = new TestElement()
        const test = new TestElement(ctx)
        const foo = new TextAssembler('foo')
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
    describe('replaceWith', () => {
        const ctx = new TestElement()
        const test = new TestElement(ctx)
        const foo = new TextAssembler('foo')
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
    })
    describe('remove()', () => {
        let $element
        const test = new TestElement([
            new TextAssembler('foobar'),
            new CommentAssembler('example'),
            $element = new TestElement(),
        ])
        const node = test.node
        $element.remove()
        it('node.childNodes.length', () => {
            assert.equal(node.childNodes.length, 2)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(node)
            const sample = '<element>foobar<!--example--></element>'
            assert.equal(xml, sample)
        })
    })
    describe('before, after, replaceWith', () => {
        let test, c1, c2, c3, items
        class Test extends ElementAssembler {}
        class C1 extends ElementAssembler {}
        class C2 extends ElementAssembler {}
        class C3 extends ElementAssembler {}
        class A1 extends AttrAssembler {}
        class OE1 extends ElementAssembler {}
        class E1 extends ElementAssembler {}
        class E2 extends ElementAssembler {}
        beforeEach(() => {
            test = new Test([
                c1 = new C1,
                c2 = new C2,
                c3 = new C3
            ])
            items = [
                'ts1',
                new E1,
                null,
                new A1({ ownerElement : new OE1 }),
                [
                    new CommentAssembler('c1'),
                    new TextAssembler('t1'),
                    false,
                    new E2,
                    'ts2',
                    [
                        new CommentAssembler('c2'),
                        undefined,
                        new TextAssembler('t2')
                    ]
                ]
            ]
        })
        it('before', () => {
            c2.before(...items)
            const sample = '<test><c1/>ts1<e1/><oe1 a1=""/><!--c1-->t1<e2/>ts2<!--c2-->t2<c2/><c3/></test>'
            assert.equal(serializer.serializeToString(test.node), sample)
        })
        it('after', () => {
            c2.after(...items)
            const sample = '<test><c1/><c2/>ts1<e1/><oe1 a1=""/><!--c1-->t1<e2/>ts2<!--c2-->t2<c3/></test>'
            assert.equal(serializer.serializeToString(test.node), sample)
        })
        it('replaceWith', () => {
            c2.replaceWith(...items)
            const sample = '<test><c1/>ts1<e1/><oe1 a1=""/><!--c1-->t1<e2/>ts2<!--c2-->t2<c3/></test>'
            assert.equal(serializer.serializeToString(test.node), sample)
        })
    })
})
