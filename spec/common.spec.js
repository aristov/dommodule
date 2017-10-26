import chai from 'chai'
import { CharacterData, EventTarget, Node, XMLSerializer } from '../lib/dom'
import {
    CharacterDataAssembler,
    EventTargetAssembler,
    DocumentAssembler,
    NodeAssembler,
    TargetAssembler,
    attr, comment, doctype, element,
    fragment, instruction, text
} from '../lib'

const { assert } = chai
const serializer = new XMLSerializer

describe('Common', () => {
    describe('new TargetAssembler', () => {
        const fn = () => new TargetAssembler
        it('throws', () => {
            assert.throws(fn, Error)
        })
    })
    describe('CharacterDataAssembler', () => {
        it('static interface', () => {
            assert.equal(CharacterDataAssembler.interface, CharacterData)
        })
    })
    describe('EventTargetAssembler', () => {
        it('static interface', () => {
            assert.equal(EventTargetAssembler.interface, EventTarget)
        })
    })
    describe('NodeAssembler', () => {
        it('static interface', () => {
            assert.equal(NodeAssembler.interface, Node)
        })
    })
    describe('DocumentAssembler', () => {
        let $attr, $doctype, $fragment, $instruction, $element, $comment, $text
        const $document = new DocumentAssembler([
            $doctype = doctype('example'),
            $fragment = fragment([
                $instruction = instruction({
                    target : 'xml-stylesheet',
                    attrset : { href : './example.css' }
                }),
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
            const sample = '<!DOCTYPE example><?xml-stylesheet href="./example.css"?><example role="application"><!--Version 1.0.0-->Hello world!</example>'
            assert.equal(serializer.serializeToString($document.node), sample)
        })
        it('index', () => {
            assert.equal($document.index, -1)
            assert.equal($document.firstChild.index, 0)
            assert.equal($document.lastChild.index, 2)
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
            assert.equal($element.previousSibling, $instruction)
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
    })
    describe('ChildNodeAssembler.remove()', () => {
        let $element
        const $root = element([
            text('foobar'),
            comment('example'),
            $element = element(),
            instruction('test')
        ])
        const node = $root.node
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
    describe('element({ onclick })', () => {
        const onclick = sinon.spy()
        const button = element({
            namespaceURI : 'http://www.w3.org/1999/xhtml',
            localName : 'button',
            onclick
        })
        button.node.click()
        it('node.onclick', () => {
            assert.equal(button.node.onclick, onclick)
        })
        it('onclick.calledOnce', () => {
            assert(onclick.calledOnce, 'onclick.calledOnce')
        })
    })
    describe('element({ foobar, undefined })', () => {
        const warn = console.warn
        const spy = console.warn = sinon.spy()
        const $element = element({ foobar : 'test', undefined })
        console.warn = warn
        it('node.foobar', () => {
            assert.isUndefined($element.node.foobar)
        })
        it('node.undefined', () => {
            assert.isUndefined($element.node.undefined)
        })
        it('console.warn.calledOnce', () => {
            assert(spy.calledOnce, 'spy.calledOnce')
        })
    })
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
})
