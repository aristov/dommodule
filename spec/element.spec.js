import chai from 'chai'
import { Assembler } from 'esmodule'
import {
    AttrAssembler,
    DocumentAssembler,
    ElementAssembler,
    TextAssembler,
} from '../lib'

const { assert } = chai
const { DOMParser, Element, Node, Text, XMLSerializer, document } = window
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

describe('ElementAssembler', () => {
    describe('Create element with custom localName', () => {
        const test = new TestElement
        const node = test.node
        it('node', () => {
            assert.instanceOf(node, Element)
        })
        it('node.nodeType', () => {
            assert.equal(node.nodeType, Node.ELEMENT_NODE)
        })
        it('node.constructor', () => {
            assert.equal(node.constructor, Element)
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element\s?\/>$/)
        })
    })
    describe('Create element without namespace', () => {
        class Foobar extends ElementAssembler {}
        const test = new Foobar
        const node = test.node
        it('node.namespaceURI', () => {
            assert.isNull(node.namespaceURI)
        })
        it('node.prefix', () => {
            assert.isNull(node.prefix)
        })
        it('node.localName', () => {
            assert.equal(node.localName, 'foobar')
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<foobar\s?\/>$/)
        })
    })
    describe('Create element with namespace and prefix', () => {
        class Bar extends ElementAssembler {
            static get namespace() {
                return 'http://example.com/namespace'
            }
            static get prefix() {
                return 'foo'
            }
        }
        const test = new Bar
        const node = test.node
        it('node.namespaceURI', () => {
            assert.equal(node.namespaceURI, 'http://example.com/namespace')
        })
        it('node.prefix', () => {
            assert.equal(node.prefix, 'foo')
        })
        it('node.localName', () => {
            assert.equal(node.localName, 'bar')
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foo:bar')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('serializeToString(node)', () => {
            const sample = /^<foo:bar xmlns:foo="http:\/\/example\.com\/namespace"\s?\/>$/
            assert.match(serializer.serializeToString(node), sample)
        })
    })
    describe('Create element with explicitly specified node', () => {
        const foobar = document.createElementNS('', 'foobar')
        const test = new TestElement({ node : foobar })
        const node = test.node
        it('node', () => {
            assert.equal(node, foobar)
        })
        it('node.tagName', () => {
            assert.equal(node.tagName, 'foobar')
        })
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('node.hasChildNodes()', () => {
            assert.isFalse(node.hasChildNodes())
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<foobar\s?\/>$/)
        })
    })
    describe('Create element with incorrectly specified node', () => {
        const foobar = document.createTextNode('foobar')
        const fn = () => new TestElement({ node : foobar })
        it('throws TypeError', () => {
            assert.throws(fn, TypeError)
        })
    })
    describe('new TestElement(new TestElement)', () => {
        const child = new TestElement
        const test = new TestElement(child)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 1)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, child)
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><element\s?\/><\/element>$/
            assert.match(serializer.serializeToString(node), sample)
        })
    })
    describe('new TestElement(document.createElementNS())', () => {
        const childNode = document.createElementNS('', 'child')
        const test = new TestElement(childNode)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.equal(node.firstChild, childNode)
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><child\s?\/><\/element>$/
            assert.match(serializer.serializeToString(node), sample)
        })
    })
    describe('new TestElement(new TextAssembler)', () => {
        const data = 'foobar'
        const text = new TextAssembler(data)
        const test = new TestElement(text)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 1)
        })
        it('firstChild', () => {
            assert.equal(test.firstChild, text)
        })
        it('textContent', () => {
            assert.equal(test.textContent, data)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new TestElement(document.createTextNode())', () => {
        const textNode = document.createTextNode('foobar')
        const test = new TestElement(textNode)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('childNodes.length', () => {
            assert.lengthOf(test.childNodes, 1)
        })
        it('node.firstChild', () => {
            assert.equal(node.firstChild, textNode)
        })
        it('textContent', () => {
            assert.equal(test.textContent, textNode.data)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('new TestElement(new String)', () => {
        const textContent = 'foobar'
        const test = new TestElement(textContent)
        const node = test.node
        it('node.tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('node.hasChildNodes()', () => {
            assert(node.hasChildNodes(), 'node.hasChildNodes()')
        })
        it('childNodes.length', () => {
            assert.equal(test.childNodes.length, 1)
        })
        it('node.firstChild', () => {
            assert.instanceOf(node.firstChild, Text)
        })
        it('textContent', () => {
            assert.equal(test.textContent, textContent)
        })
        it('serializeToString(node)', () => {
            const sample = '<element>foobar</element>'
            assert.equal(serializer.serializeToString(node), sample)
        })
    })
    describe('Foo.getAttrOf(TestElement)', () => {
        class Foo extends AttrAssembler {}
        const test = new TestElement
        test.setAttr(Foo, 'bar')
        const attr = Foo.getAttrOf(test)
        it('attr instanceof AttrAssembler', () => {
            assert.instanceOf(attr, AttrAssembler)
        })
        it('attr.node.localName', () => {
            assert.equal(attr.node.localName, 'foo')
        })
        it('attr.node.value', () => {
            assert.equal(attr.node.value, 'bar')
        })
    })
    describe('getAttr(new String)', () => {
        const test = new TestElement
        const node = test.node
        node.setAttribute('foo', 'bar')
        it('getAttr', () => {
            assert.equal(test.getAttr('foo'), 'bar')
        })
    })
    describe('setAttr(document.createAttribute())', () => {
        const test = new TestElement
        const node = test.node
        const attrNode = document.createAttribute('foo')
        attrNode.value = 'bar'
        test.setAttr(attrNode)
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 1)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr('foo'), 'hasAttr()')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute('foo'), 'bar')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element foo="bar"\s?\/>$/)
        })
    })
    describe('setAttr(new TestAttr)', () => {
        class Foo extends AttrAssembler {}
        const test = new TestElement({ attributes : { foo : 'wiz' } })
        const node = test.node
        const attr = new Foo({ value : 'bar' })
        test.setAttr(attr)
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 1)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr('foo'), 'hasAttr()')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute('foo'), 'bar')
        })
        it('getAttr()', () => {
            assert.equal(test.getAttr('foo'), 'bar')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element foo="bar"\s?\/>$/)
        })
    })
    describe('removeAttr(new TestAttr)', () => {
        const test = new TestElement
        const node = test.node
        const attr = new TestAttr('foobar')
        test.setAttr(attr)
        test.removeAttr(attr)
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 0)
        })
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr(TestAttr.localName))
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element\s?\/>$/)
        })
    })
    describe('node.setAttributeNode(document.createAttribute()); removeAttr()', () => {
        const test = new TestElement
        const node = test.node
        const attrNode = document.createAttribute('foobar')
        node.setAttributeNode(attrNode)
        test.removeAttr(attrNode)
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 0)
        })
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr('foobar'))
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element\s?\/>$/)
        })
    })
    describe('removeAttr(TestAttr)', () => {
        const test = new TestElement
        const node = test.node
        const attrNode = document.createAttribute('attr')
        node.setAttributeNode(attrNode)
        test.removeAttr(TestAttr)
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr('attr'))
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element\s?\/>$/)
        })
    })
    describe('removeAttr(class extends AttrAssembler)', () => {
        const test = new TestElement
        const node = test.node
        node.setAttribute('foo', 'bar')
        class Foo extends AttrAssembler {}
        test.removeAttr(Foo)
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr('foo'))
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element\s?\/>$/)
        })
    })
    describe('removeAttr(new String)', () => {
        const test = new TestElement
        const node = test.node
        const name = 'foobar'
        const attrNode = document.createAttribute(name)
        node.setAttributeNode(attrNode)
        test.removeAttr(name)
        it('node.hasAttributes()', () => {
            assert.isFalse(node.hasAttributes())
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 0)
        })
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr(name))
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element\s?\/>$/)
        })
    })
    describe('setAttr(new String, new String)', () => {
        const test = new TestElement
        const node = test.node
        test.setAttr('foo', 'bar')
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 1)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr('foo'), 'hasAttr()')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute('foo'), 'bar')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element foo="bar"\s?\/>$/)
        })
    })
    describe('setAttr(TestAttr, new String)', () => {
        const test = new TestElement
        const node = test.node
        test.setAttr(TestAttr, 'foobar')
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 1)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr(TestAttr.localName), 'hasAttr()')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute(TestAttr.localName), 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element attr="foobar"\s?\/>$/)
        })
    })
    describe('node.setAttribute(); setAttr(TestAttr, new String)', () => {
        const test = new TestElement
        const node = test.node
        node.setAttribute('attr', 'test')
        test.setAttr(TestAttr, 'foobar')
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('attributes.length', () => {
            assert.lengthOf(test.attributes, 1)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr(TestAttr.localName), 'hasAttr()')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute(TestAttr.localName), 'foobar')
        })
        it('serializeToString(node)', () => {
            assert.match(serializer.serializeToString(node), /^<element attr="foobar"\s?\/>$/)
        })
    })
    describe('hasAttr(TestAttr); getAttribute(TestAttr)', () => {
        const test = new TestElement({ attributes : { attr : 'foobar' } })
        it('hasAttr()', () => {
            assert(test.hasAttr(TestAttr), 'hasAttr(TestAttr)')
        })
        it('getAttr()', () => {
            assert.equal(test.getAttr(TestAttr), 'foobar')
        })
    })
    describe('hasAttr and getAttribute', () => {
        class Bar extends AttrAssembler {}
        const test = new TestElement({ attributes : new Bar('test') })
        it('hasAttr()', () => {
            assert(test.hasAttr(Bar), 'hasAttr(Bar)')
        })
        it('getAttr()', () => {
            assert.equal(test.getAttr(Bar), 'test')
        })
    })
    describe('removeAttr(new String)', () => {
        const test = new TestElement({ attributes : { foo : 'bar' } })
        const node = test.node
        test.removeAttr('foo')
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr('foo'))
        })
    })
    describe('removeAttr(TestAttr)', () => {
        const test = new TestElement({ attributes : { attr : 'foobar' } })
        const node = test.node
        test.removeAttr(TestAttr)
        it('hasAttr()', () => {
            assert.isFalse(test.hasAttr('attr'))
        })
    })
    describe('removeAttr(class extends AttrAssembler)', () => {
        class Bar extends AttrAssembler {}
        const test = new TestElement({ attributes : new Bar('test') })
        const node = test.node
        it('node.hasAttributes()', () => {
            assert(node.hasAttributes(), 'node.hasAttributes()')
        })
        it('removeAttr; node.hasAttributes()', () => {
            test.removeAttr(Bar)
            assert.isFalse(node.hasAttributes())
        })
    })
    describe('on(new String, handler)', () => {
        const test = new TestElement
        const handler = sinon.spy()
        test.on('foobar', handler)
        it('handler.notCalled', () => {
            assert(handler.notCalled, 'hanlder.notCalled')
        })
        it('emit(new String) => handler.calledOnce', () => {
            test.emit('foobar')
            assert(handler.calledOnce, 'handler.calledOnce')
        })
        it('un(new String, hanlder); emit(new String) => handler.calledOnce', () => {
            test.un('foobar', handler)
            test.emit('foobar')
            assert(handler.calledOnce, 'handler.calledOnce')
        })
    })
    describe('id', () => {
        const test = new TestElement({ id : 'foobar' })
        it('id', () => {
            assert.equal(test.id, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.match(xml, /^<element id="foobar"\s?\/>$/)
        })
    })
    describe('className', () => {
        const test = new TestElement({ className : 'foo bar' })
        it('className', () => {
            assert.equal(test.className, 'foo bar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.match(xml, /^<element class="foo bar"\s?\/>$/)
        })
    })
    describe('className = ""', () => {
        const test = new TestElement({ className : 'foo bar' })
        test.className = ''
        it('className', () => {
            assert.equal(test.className, '')
        })
    })
    describe('classList = new Array', () => {
        const test = new TestElement
        test.classList = ['foo', 'bar']
        it('className', () => {
            assert.equal(test.className, 'foo bar')
        })
        it('classList', () => {
            assert.instanceOf(test.classList, window.DOMTokenList)
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
            assert(test.classList.contains('bar'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.match(xml, /^<element class="foo bar"\s?\/>$/)
        })
    })
    describe('classList = new Object', () => {
        const test = new TestElement
        test.classList = { foo : true, bar : false, wiz : true }
        it('className', () => {
            assert.equal(test.className, 'foo wiz')
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
            assert(test.classList.contains('wiz'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.match(xml, /^<element class="foo wiz"\s?\/>$/)
        })
    })
    describe('classList = new String', () => {
        const test = new TestElement({ className : 'foo' })
        test.classList = 'bar'
        it('className', () => {
            assert.equal(test.className, 'foo bar')
        })
        it('classList.contains', () => {
            assert(test.classList.contains('foo'))
            assert(test.classList.contains('bar'))
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.match(xml, /^<element class="foo bar"\s?\/>$/)
        })
    })
    describe('classList = false', () => {
        const test = new TestElement({ className : 'foo' })
        test.classList = false
        it('className', () => {
            assert.equal(test.className, 'foo')
        })
        it('classList.contains()', () => {
            assert(test.classList.contains('foo'), 'classList.contains()')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.match(xml, /^<element class="foo"\s?\/>$/)
        })
    })
    describe('class extends ElementAssembler', () => {
        class Bar extends ElementAssembler {
            static get namespace() {
                return 'http://example.com/ns'
            }
            static get prefix() {
                return 'foo'
            }
        }
        const parent = new TestElement()
        const test = new Bar({ parentNode : parent, className : 'wiz' })
        it('node.namespaceURI', () => {
            assert.equal(test.node.namespaceURI, 'http://example.com/ns')
        })
        it('node.tagName', () => {
            assert.equal(test.node.tagName, Bar.qualifiedName)
        })
        it('parent.find(className)', () => {
            assert.equal(parent.find('.wiz'), test)
        })
        it.skip('parent.find(Bar)', () => { // todo jsdom
            assert.equal(parent.find(Bar), test)
        })
        it('static selector', () => {
            assert.equal(Bar.selector, 'bar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<foo:bar xmlns:foo="http://example.com/ns" class="wiz"/>')
        })
    })
    describe('new TestElement(new TestElement(), null, new TestElement(), new TestElement())', () => {
        let test, foo, bar, wiz
        beforeEach(() => {
            test = new TestElement([
                foo = new TestElement('foo'),
                null,
                bar = new TestElement('bar'),
                wiz = new TestElement('wiz')
            ])
        })
        it('closest(new String)', () => {
            assert.equal(foo.closest('element'), foo)
        })
        it('closest(TestElement)', () => {
            assert.equal(foo.closest(TestElement), foo)
        })
        it('node.childElementCount', () => {
            assert.equal(test.node.childElementCount, 3)
        })
        it('firstElementChild', () => {
            assert.equal(test.firstElementChild, foo)
        })
        it('lastElementChild', () => {
            assert.equal(test.lastElementChild, wiz)
        })
        it('elementIndex', () => {
            assert.equal(foo.elementIndex, 0)
            assert.equal(bar.elementIndex, 1)
            assert.equal(wiz.elementIndex, 2)
        })
        it('nextElementSibling', () => {
            assert.equal(foo.nextElementSibling, bar)
            assert.equal(bar.nextElementSibling, wiz)
            assert.isNull(wiz.nextElementSibling)
        })
        it('previousElementSibling', () => {
            assert.isNull(foo.previousElementSibling)
            assert.equal(bar.previousElementSibling, foo)
            assert.equal(wiz.previousElementSibling, bar)
        })
        it('find', () => {
            assert.equal(test.find('element'), foo)
        })
        it('findAll', () => {
            const all = test.findAll('element')
            assert.instanceOf(all, Array)
            assert.equal(all[0], foo)
            assert.equal(all[1], bar)
            assert.equal(all[2], wiz)
        })
        it('findAll(new String)', () => {
            const all = test.findAll('element')
            assert.equal(all[0], foo)
            assert.equal(all[1], bar)
            assert.equal(all[2], wiz)
        })
        it('findAll(ElementAssembler)', () => {
            const all = test.findAll(ElementAssembler)
            // assert.equal(ElementAssembler.qualifiedName, 'element')
            assert.equal(all[0], foo)
            assert.equal(all[1], bar)
            assert.equal(all[2], wiz)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element>' +
                '<element>foo</element>' +
                '<element>bar</element>' +
                '<element>wiz</element>' +
                '</element>'
            assert.equal(xml, sample)
        })
        it('child.remove(); childNodes.length; elementIndex', () => {
            bar.remove()
            assert.equal(test.childNodes.length, 2)
            assert.equal(bar.elementIndex, -1)
            assert.equal(wiz.elementIndex, 1)
            const xml = serializer.serializeToString(test.node)
            const sample = '<element>' +
                '<element>foo</element>' +
                '<element>wiz</element>' +
                '</element>'
            assert.equal(xml, sample)
        })
    })
    describe('new TestElement({ parentNode : new DocumentAssembler })', () => {
        const doc = new DocumentAssembler
        const test = new TestElement({ parentNode : doc })
        it('parentNode', () => {
            assert.equal(test.parentNode, doc)
        })
        it('serializeToString(doc.node)', () => {
            assert.equal(serializer.serializeToString(doc.node), '<element/>')
        })
    })
    describe('new TestElement({ attributes })', () => {
        const test = new TestElement({ attributes : { foo : 'bar', cux : 'wiz' } })
        it('attributes.length', () => {
            assert.equal(test.attributes.length, 2)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr('foo'), 'hasAttr("foo")')
            assert(test.hasAttr('cux'), 'hasAttr("cux")')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute('foo'), 'bar')
            assert.equal(test.node.getAttribute('cux'), 'wiz')
        })
    })
    describe('new TestElement({ attributes : new Array })', () => {
        class Foo extends AttrAssembler {}
        let foo, wiz
        const test = new TestElement({
            attributes : [
                foo = new Foo({ value : 'bar' }),
                wiz = document.createAttribute('wiz')
            ]
        })
        const attributes = test.attributes
        it('attributes.length', () => {
            assert.equal(test.attributes.length, 2)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr('foo'), 'hasAttr("foo")')
            assert(test.hasAttr('wiz'), 'hasAttr("wiz")')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute('foo'), 'bar')
            assert.equal(test.node.getAttribute('wiz'), '')
        })
        it('attributes', () => {
            assert.equal(attributes[0], foo)
            assert.equal(attributes[1].node, wiz)
        })
        it.skip('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = '<element foo="bar" wiz=""/>'
            assert.equal(xml, sample)
        })
        it('setAttr(new TestAttr)', () => {
            const attr = new Foo({ value : 'test' })
            test.setAttr(attr)
            it('attributes', () => {
                assert.equal(attributes.length, 2)
                assert.equal(attributes[0], attr)
            })
            it('node.getAttribute', () => {
                assert.equal(test.node.getAttribute('foo'), 'test')
            })
        })
    })
    describe('setAttr(document.createAttributeNS())', () => {
        const test = new TestElement
        const attrNode = document.createAttributeNS('http://example.com/ns', 'foo:bar')
        test.setAttr(attrNode)
        it('attributes', () => {
            assert.equal(test.attributes.length, 1)
            assert.equal(test.attributes[0].node, attrNode)
        })
        it('node.getAttributeNS', () => {
            assert.equal(test.node.getAttributeNS('http://example.com/ns', 'bar'), '')
        })
    })
    describe('new TestElement({ attributes : document.createAttribute() })', () => {
        const foobar = document.createAttribute('foobar')
        const test = new TestElement({ attributes : foobar })
        const attributes = test.attributes
        it('attributes.length', () => {
            assert.equal(test.attributes.length, 1)
        })
        it('hasAttr()', () => {
            assert(test.hasAttr('foobar'), 'hasAttr()')
        })
        it('node.getAttribute()', () => {
            assert.equal(test.node.getAttribute('foobar'), '')
        })
        it('attributes', () => {
            assert.equal(attributes[0].node, foobar)
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            const sample = /^<element foobar=""\s?\/>$/
            assert.match(xml, sample)
        })
    })
    describe('children', () => {
        class Bar extends ElementAssembler {}
        let test, foo, bar, wiz, children
        beforeEach(() => {
            test = new TestElement({
                children : [
                    foo = document.createElementNS('', 'foo'),
                    bar = new Bar,
                    wiz = document.createElementNS('', 'wiz'),
                ]
            })
            children = test.children
        })
        it('children.length', () => {
            assert.equal(children.length, 3)
        })
        it('children[*].instanceof', () => {
            assert.instanceOf(children[0], ElementAssembler)
            assert.instanceOf(children[1], ElementAssembler)
            assert.instanceOf(children[2], ElementAssembler)
        })
        it('children[*]', () => {
            assert.equal(children[0].node, foo)
            assert.equal(children[1], bar)
            assert.equal(children[2].node, wiz)
        })
        it('serializeToString(node)', () => {
            const sample = /^<element><foo\s?\/><bar\s?\/><wiz\s?\/><\/element>$/
            assert.match(serializer.serializeToString(test.node), sample)
        })
    })
    describe('init', () => {
        class Test extends ElementAssembler {
            init(init) {
                spy()
                super.init(init)
            }
        }
        class E1 extends ElementAssembler {}
        class E2 extends ElementAssembler {}
        const sample = '<test><e1 id="id1"/><e2 id="id2"><e1 id="id3"/></e2><e1 id="id4"><e2 id="id5"/></e1></test>'
        let doc, res, id1, id2, id3, id4, id5, spy
        beforeEach(() => {
            doc = parser.parseFromString(sample, 'application/xml')
            id1 = doc.getElementById('id1')
            id2 = doc.getElementById('id2')
            id3 = doc.getElementById('id3')
            id4 = doc.getElementById('id4')
            id5 = doc.getElementById('id5')
            spy = sinon.spy()
        })
        it('Test.init()', () => {
            res = Test.init(doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], Test)
            assert.equal(res[0].node, doc.documentElement)
            assert(spy.calledOnce, 'init called once')
        })
        it('Test.init("#id0")', () => {
            res = Test.init('#id0', doc)
            assert.lengthOf(res, 0)
            assert(spy.notCalled, 'init not called')
        })
        it('E1.init()', () => {
            res = E1.init(doc)
            assert.lengthOf(res, 3)
            assert.instanceOf(res[0], E1)
            assert.instanceOf(res[1], E1)
            assert.instanceOf(res[2], E1)
            assert.equal(res[0].node, id1)
            assert.equal(res[1].node, id3)
            assert.equal(res[2].node, id4)
        })
        it('E1.init(null, #id2)', () => {
            res = E1.init(id2)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], E1)
            assert.equal(res[0].node, id3)
        })
        it('E2.init()', () => {
            res = E2.init(doc)
            assert.lengthOf(res, 2)
            assert.instanceOf(res[0], E2)
            assert.instanceOf(res[1], E2)
            assert.equal(res[0].node, id2)
            assert.equal(res[1].node, id5)
        })
        it('E1.init("#id1")', () => {
            res = E1.init('#id1', doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], E1)
            assert.equal(res[0].node, id1)
        })
        it('E1.init("#id2")', () => {
            res = E1.init('#id2', doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], E1)
            assert.equal(res[0].node, id2)
        })
        it('E2.init("#id5")', () => {
            res = E2.init('#id5', doc)
            assert.lengthOf(res, 1)
            assert.instanceOf(res[0], E2)
            assert.equal(res[0].node, id5)
        })
    })
    describe('getAssemblerOf', () => {
        const namespace = 'http://example.com/ns#'
        class E1 extends ElementAssembler {}
        E1.register()
        class Ex extends ElementAssembler {
            static get namespace() {
                return namespace
            }
            static get superAssembler() {
                return Ex
            }
        }
        Ex.register()
        class E2 extends Ex {}
        E2.register()
        class E3 extends E2 {}
        E3.register()
        it('localName only', () => {
            const element = document.createElementNS('', 'e1')
            assert.equal(ElementAssembler.getAssemblerOf(element), E1)
        })
        it('unknown localName', () => {
            const element = document.createElementNS('', 'e0')
            assert.equal(ElementAssembler.getAssemblerOf(element), ElementAssembler)
        })
        it('namespace + localName', () => {
            const element = document.createElementNS(namespace, 'e2')
            assert.equal(ElementAssembler.getAssemblerOf(element), E2)
        })
        it('namespace + localName', () => {
            const element = document.createElementNS(namespace, 'e3')
            assert.equal(ElementAssembler.getAssemblerOf(element), E3)
        })
        it('namespace + unknown localName', () => {
            const element = document.createElementNS(namespace, 'e4')
            assert.equal(ElementAssembler.getAssemblerOf(element), Ex)
        })
        it('unknown namespace + any localName', () => {
            const element1 = document.createElementNS('http://example.org/ns#', 'e1')
            const element2 = document.createElementNS('http://example.org/ns#', 'e0')
            assert.equal(ElementAssembler.getAssemblerOf(element1), ElementAssembler)
            assert.equal(ElementAssembler.getAssemblerOf(element2), ElementAssembler)
        })
    })
    describe('generateId', () => {
        const id = ElementAssembler.generateId()
        it('match', () => {
            assert.match(id, /^ElementAssembler\d{13,}$/)
        })
        it('unique', () => {
            assert.notEqual(ElementAssembler.generateId(), id)
        })
    })
})
