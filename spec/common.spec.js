import chai from 'chai'
import { CharacterData, EventTarget, Node, XMLSerializer } from '../lib/dom'
import {
    CharacterDataAssembler,
    EventTargetAssembler,
    NodeAssembler,
    DocumentAssembler,
    attr, comment, doctype, element,
    fragment, instruction, text
} from '../lib'

const { assert } = chai

const serializer = new XMLSerializer

describe('Common', () => {
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
})
