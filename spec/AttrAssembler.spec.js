import chai from 'chai'
import { AttrAssembler, ElementAssembler } from '../lib'

const { assert } = chai
const { Attr, DOMParser, Node, XMLSerializer, document } = window
const parser = new DOMParser
const serializer = new XMLSerializer

class TestElement extends ElementAssembler {
    static get localName() {
        return 'element'
    }
}
class TestAttr extends AttrAssembler {
    static get localName() {
        return 'attr'
    }
}

describe('AttrAssembler', () => {
    describe('new TestAttr', () => {
        const name = TestAttr.localName
        const test = new TestAttr
        const node = test.node
        it('node', () => {
            assert.instanceOf(test.node, Attr)
        })
        it('name', () => {
            assert.equal(test.name, name)
        })
        it('value', () => {
            assert.equal(test.value, '')
        })
        it('node.nodeType', () => { 
            assert.equal(node.nodeType, Node.ATTRIBUTE_NODE)
        })
        it('node.nodeName', () => {
            assert.equal(node.nodeName, name)
        })
        it('node.nodeValue', () => {
            assert.equal(node.nodeValue, '')
        })
    })
    describe('Create attribute with localName from class name', () => {
        class Foobar extends AttrAssembler {}
        const test = new Foobar
        it('name', () => {
            assert.equal(test.name, Foobar.localName)
        })
        it('value', () => {
            assert.equal(test.value, '')
        })
    })
    describe('Create attribute with value', () => {
        class Foo extends AttrAssembler {}
        const test = new Foo({ value : 'bar' })
        it('name', () => {
            assert.equal(test.name, Foo.localName)
        })
        it('value', () => {
            assert.equal(test.value, 'bar')
        })
    })
    describe('new TestAttr({ node })', () => {
        const node = document.createAttribute('foo')
        const test = new TestAttr({ node })
        it('nodes equal', () => {
            assert.equal(test.node, node)
        })
        it('ownerElement', () => {
            assert.isNull(test.ownerElement)
        })
    })
    describe('new TestAttr(new String)', () => {
        const test = new TestAttr('foobar')
        it('name', () => {
            assert.equal(test.name, 'attr')
        })
        it('value', () => {
            assert.equal(test.value, 'foobar')
        })
    })
    describe('value = new String', () => {
        const test = new TestAttr
        test.value = 'foobar'
        it('node.value', () => {
            assert.equal(test.node.value, 'foobar')
        })
        it('value', () => {
            assert.equal(test.value, 'foobar')
        })
    })
    describe('ownerElement = new TestElement', () => {
        const test = new TestAttr({ value : 'foobar' })
        const ownerElement = new TestElement
        test.ownerElement = ownerElement
        it('node.ownerElement', () => {
            assert.equal(test.node.ownerElement, ownerElement.node)
        })
        it('ownerElement', () => {
            assert.equal(test.ownerElement, ownerElement)
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(ownerElement.node)
            assert.match(xml, /^<element attr="foobar"\s?\/>$/)
        })
    })
    describe('ownerElement = document.createElementNS()', () => {
        class Foo extends AttrAssembler {}
        const test = new Foo({ value : 'bar' })
        const elementNode = document.createElementNS('', 'foobar')
        test.ownerElement = elementNode
        it('node.ownerElement', () => {
            assert.equal(test.node.ownerElement, elementNode)
        })
        it('ownerElement', () => {
            assert.instanceOf(test.ownerElement, ElementAssembler)
        })
        it('ownerElement.node', () => {
            assert.equal(test.ownerElement.node, elementNode)
        })
        it('serializeToString(element)', () => {
            const xml = serializer.serializeToString(elementNode)
            assert.match(xml, /^<foobar foo="bar"\s?\/>$/)
        })
    })
    describe('remove()', () => {
        const test = new TestAttr({ value : 'foobar' })
        const ownerElement = new TestElement
        ownerElement.setAttr(test)
        test.remove()
        it('node.ownerElement', () => {
            assert.isNull(test.node.ownerElement)
        })
        it('element.node.hasAttributes()', () => {
            assert.isFalse(ownerElement.node.hasAttributes())
        })
        it('serializeToString(element.node)', () => {
            const xml = serializer.serializeToString(ownerElement.node)
            assert.match(xml, /^<element\s?\/>$/)
        })
    })
    describe('new TestAttr({ ownerElement }); remove()', () => {
        const ownerElement = new TestElement
        const test = new TestAttr({ ownerElement })
        test.remove()
        it('ownerElement.hasAttr()', () => {
            assert.isFalse(ownerElement.hasAttr(TestAttr.localName))
        })
    })
    describe('init', () => {
        class Test extends AttrAssembler {
            init(init) {
                spy()
                super.init(init)
            }
        }
        class A1 extends AttrAssembler {}
        class A2 extends AttrAssembler {}
        const sample = '<re test=""><el a1="id1"/><el a2="id2"><el a1="id3"/></el><el a1="id4"><el a2="id5"/></el></re>'
        let doc, docElement, res, id1, id2, id3, id4, id5, spy
        beforeEach(() => {
            doc = parser.parseFromString(sample, 'application/xml')
            docElement = doc.documentElement
            id1 = doc.querySelector('[a1=id1]')
            id2 = doc.querySelector('[a2=id2]')
            id3 = doc.querySelector('[a1=id3]')
            id4 = doc.querySelector('[a1=id4]')
            id5 = doc.querySelector('[a2=id5]')
            spy = sinon.spy()
        })
        it('Init root without selector', () => {
            res = Test.init(doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], Test)
            assert.equal(res[0].node, docElement.attributes.test)
            assert.equal(res[0].node.ownerElement, docElement)
            assert(spy.calledOnce, 'init called once')
        })
        it('Init root by not matching selector', () => {
            res = Test.init('[test=test]', doc)
            assert.lengthOf(res, 0)
            assert(spy.notCalled, 'init not called')
        })
        it('Init multiple nested items on root without selector (1)', () => {
            res = A1.init(doc)
            assert.lengthOf(res, 3)
            assert.instanceOf(res[0], A1)
            assert.instanceOf(res[1], A1)
            assert.instanceOf(res[2], A1)
            assert.equal(res[0].node, id1.attributes.a1)
            assert.equal(res[1].node, id3.attributes.a1)
            assert.equal(res[2].node, id4.attributes.a1)
            assert.equal(res[0].node.ownerElement, id1)
            assert.equal(res[1].node.ownerElement, id3)
            assert.equal(res[2].node.ownerElement, id4)
        })
        it('Init on specified element without selector', () => {
            res = A1.init(id2)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], A1)
            assert.equal(res[0].node, id3.attributes.a1)
        })
        it('Init multiple nested items on root without selector (2)', () => {
            res = A2.init(doc)
            assert.lengthOf(res, 2)
            assert.instanceOf(res[0], A2)
            assert.instanceOf(res[1], A2)
            assert.equal(res[0].node, id2.attributes.a2)
            assert.equal(res[1].node, id5.attributes.a2)
            assert.equal(res[0].node.ownerElement, id2)
            assert.equal(res[1].node.ownerElement, id5)
        })
        it('Init by selector with specified attribute value (1)', () => {
            res = A1.init('[a1=id1]', doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], A1)
            assert.equal(res[0].node, id1.attributes.a1)
            assert.equal(res[0].node.ownerElement, id1)
        })
        it('Init by selector and set the created attribute', () => {
            res = A1.init('[a2=id2]', doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], A1)
            assert.equal(res[0].node, id2.attributes.a1)
            assert.equal(res[0].node.ownerElement, id2)
            assert.lengthOf(id2.attributes, 2)
            assert.isTrue(id2.hasAttribute('a1'))
            assert.isTrue(id2.hasAttribute('a2'))
            assert.equal(id2.getAttribute('a1'), '')
            assert.equal(id2.getAttribute('a2'), 'id2')
        })
        it('Init by selector with specified attribute value (2)', () => {
            res = A2.init('[a2=id5]', doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], A2)
            assert.equal(res[0].node, id5.attributes.a2)
            assert.equal(res[0].node.ownerElement, id5)
        })
    })
    describe('new TestAttr({ ownerElement = node })', () => {
        class OE1 extends ElementAssembler {}
        class OE2 extends ElementAssembler {}
        class OE3 extends ElementAssembler {}
        class TestAttr1 extends AttrAssembler {
            static get elementAssembler() {
                return OE1
            }
        }
        class TestAttr2 extends AttrAssembler {
            static get elementAssembler() {
                return OE3
            }
        }
        OE1.register()
        OE2.register()
        const dom = parser.parseFromString('<root><OE1/><OE2/><OE3/><OE4/></root>', 'application/xml')
        const a1 = new TestAttr1({ ownerElement : dom.querySelector('OE1') })
        const a2 = new TestAttr1({ ownerElement : dom.querySelector('OE2') })
        const a3 = new TestAttr2({ ownerElement : dom.querySelector('OE3') })
        const a4 = new TestAttr2({ ownerElement : dom.querySelector('OE4') })
        it('ownerElement (registered and the same as elementAssembler)', () => {
            assert.equal(a1.ownerElement.constructor, OE1)
        })
        it('ownerElement (registered and different with elementAssembler)', () => {
            assert.equal(a2.ownerElement.constructor, OE2)
        })
        it('ownerElement (not registered and the same as elementAssembler)', () => {
            assert.equal(a3.ownerElement.constructor, OE3)
        })
        it('ownerElement (not registered and different with elementAssembler)', () => {
            assert.equal(a4.ownerElement.constructor, ElementAssembler)
        })
    })
    describe('defaultValue', () => {
        class Foo extends AttrAssembler {}
        class Bar extends AttrAssembler {
            static get defaultValue() {
                return 'false'
            }
        }
        let test1, test2
        beforeEach(() => {
            test1 = new TestElement({ attributes : new Foo('bar') })
            test2 = new TestElement({ attributes : new Bar('foo') })
        })
        it('inherited default value', () => {
            assert.equal(test1.getAttr(Foo), 'bar')
            assert.equal(test2.getAttr(Foo), null)
        })
        it('specified default value', () => {
            assert.equal(test1.getAttr(Bar), 'false')
            assert.equal(test2.getAttr(Bar), 'foo')
        })
    })
    describe('getAttrOf', () => {
        class SomeAttr extends AttrAssembler {}
        let elem, attr
        beforeEach(() => {
            attr = new TestAttr({
                ownerElement : elem = new TestElement,
                value : 'foobar'
            })
        })
        it('existing attr', () => {
            assert.equal(TestAttr.getAttrOf(elem), attr)
        })
        it('non existing attr', () => {
            assert.equal(SomeAttr.getAttrOf(elem), null)
        })
    })
})
