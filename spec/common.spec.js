import chai from 'chai'
import { CharacterDataAssembler } from '../lib/characterdata'
import { NodeAssembler } from '../lib/node'
import {
    EventTargetAssembler,
    DocumentAssembler,
    attr, comment, doctype, element,
    fragment, text
} from '../lib'

const { assert } = chai
const { CharacterData, EventTarget, Node, XMLSerializer } = window
const serializer = new XMLSerializer

describe('Common', () => {
    /*describe('new Assembler', () => {
        const assembler = new Assembler
        it('_target', () => {
            assert.instanceOf(assembler._target, Assembler.interface)
        })
    })*/
    describe('NodeAssembler', () => {
        it('static interface', () => {
            assert.equal(NodeAssembler.interface, Node)
        })
    })
    describe('EventTargetAssembler', () => {
        it('static interface', () => {
            assert.equal(EventTargetAssembler.interface, EventTarget)
        })
    })
    describe('CharacterDataAssembler', () => {
        it('static interface', () => {
            assert.equal(CharacterDataAssembler.interface, CharacterData)
        })
    })
    /*describe('Example', () => { // todo MS Edge
        let $attr, $doctype, $fragment, $element, $comment, $text
        const $document = new DocumentAssembler([
            $doctype = doctype('example'),
            $fragment = fragment([
                $element = element({
                    localName : 'example',
                    attributes : $attr = attr({
                        name : 'role',
                        value : 'application'
                    }),
                    childNodes : [
                        $comment = comment('Version 1.0.0'),
                        $text = text('Hello world!')
                    ]
                })
            ])
        ])
        it('serializeToString(dom)', () => {
            const sample = /^<\!DOCTYPE example>\n?<example role="application"><\!--Version 1\.0\.0-->Hello world\!<\/example>$/
            assert.match(serializer.serializeToString($document.node), sample)
        })
        it('index', () => {
            assert.equal($document.index, -1)
            assert.equal($document.firstChild.index, 0)
            assert.equal($document.lastChild.index, 1)
        })
        it('documentElement', () => {
            assert.equal($document.documentElement, $element)
        })
        it('doctype', () => {
            assert.equal($document.doctype, $doctype)
        })
        it('nextSibling', () => {
            assert.equal($comment.nextSibling, $text)
        })
        it('previousSibling', () => {
            assert.equal($element.previousSibling, $doctype)
        })
        it('fragment.parentNode', () => {
            assert.isNull($fragment.parentNode)
        })
        it('fragment.node.hasChildNodes()', () => {
            assert.isFalse($fragment.node.hasChildNodes())
        })
        it('attr.ownerElement', () => {
            assert.equal($attr.ownerElement, $element)
        })
        it('contains', () => {
            assert($document.contains($doctype), 'doctype')
            assert($document.contains($element), 'element')
            assert($document.contains($comment.node), 'comment')
            assert($document.contains($text), 'text')
            assert.isFalse($document.contains($fragment.node))
            assert($element.contains($comment.node), 'element contains comment')
            assert($element.contains($text), 'element contains text')
        })
    })*/
    describe('ChildNodeAssembler.remove()', () => {
        const test = element()
        test.remove()
        it('parentNode', () => {
            assert.isNull(test.parentNode)
        })
    })
    describe('ChildNodeAssembler.remove()', () => {
        let $element
        const test = element([
            text('foobar'),
            comment('example'),
            $element = element(),
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
    describe('element({ onclick })', () => {
        const onclick = sinon.spy()
        const test = element({
            namespace : 'http://www.w3.org/1999/xhtml',
            localName : 'button',
            onclick
        })
        test.node.click()
        it('node.onclick', () => {
            assert.equal(test.node.onclick, onclick)
        })
        it('onclick.calledOnce', () => {
            assert(onclick.calledOnce, 'onclick.calledOnce')
        })
    })
    /*describe('element({ foobar, undefined })', () => {
        const warn = console.warn
        const spy = console.warn = sinon.spy()
        const test = element({ foobar : 'test', undefined })
        console.warn = warn
        it('node.foobar', () => {
            assert.isUndefined(test.node.foobar)
        })
        it('node.undefined', () => {
            assert.isUndefined(test.node.undefined)
        })
        it('console.warn.calledOnce', () => {
            assert(spy.calledOnce, 'spy.calledOnce')
        })
    })*/
    describe('element({ textContent })', () => {
        const test = element({ textContent : 'foobar' })
        it('parent.textContent', () => {
            assert.equal(test.textContent, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element>foobar</element>')
        })
    })
    describe('isEqualNode', () => {
        const e1 = element()
        const e2 = element()
        it('isEqualNode', () => {
            assert(e1.isEqualNode(e2), 'isEqualNode')
            assert(e1.isEqualNode(e2.node), 'isEqualNode')
        })
    })
})
