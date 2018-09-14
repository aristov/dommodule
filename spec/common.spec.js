import chai from 'chai'
import { CharacterDataAssembler } from '../lib/CharacterDataAssembler'
import { NodeAssembler } from '../lib/NodeAssembler'
import {
    EventTargetAssembler,
    DocumentAssembler,
    AttrAssembler,
    CommentAssembler,
    DocumentTypeAssembler,
    DocumentFragmentAssembler,
    TextAssembler,
    ElementAssembler
} from '../lib'

const { assert } = chai
const { CharacterData, EventTarget, Node, XMLSerializer } = window
const serializer = new XMLSerializer

class TestElement extends ElementAssembler {
    static get localName() {
        return 'element'
    }
}

describe('Common', () => {
    describe('new EventTargetAssembler', () => {
        const instance = new EventTargetAssembler
        it('getTargetOf', () => {
            assert.instanceOf(EventTargetAssembler.getTargetOf(instance), EventTarget)
        })
    })
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
    describe('Example', () => { 
        class Example extends ElementAssembler {}
        class TestDoctype extends DocumentTypeAssembler {
            static get qualifiedName() {
                return Example.qualifiedName
            }
        }
        class Role extends AttrAssembler {}
        let $attr, $doctype, $fragment, $element, $comment, $text
        const $document = new DocumentAssembler([
            $doctype = new TestDoctype,
            $fragment = new DocumentFragmentAssembler([
                $element = new Example({
                    attributes : $attr = new Role('application'),
                    children : [
                        $comment = new CommentAssembler('Version 1.0.0'),
                        $text = new TextAssembler('Hello world!')
                    ]
                })
            ])
        ])
        it('serializeToString(dom)', () => {
            const sample = /^<\!DOCTYPE Example>\n?<Example role="application"><\!--Version 1\.0\.0-->Hello world\!<\/Example>$/
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
    })
    describe('ChildNodeAssembler.remove()', () => {
        const test = new TestElement()
        test.remove()
        it('parentNode', () => {
            assert.isNull(test.parentNode)
        })
    })
    describe('ChildNodeAssembler.remove()', () => {
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
    describe('new Button({ onclick })', () => {
        class Button extends ElementAssembler {
            static get namespace() {
                return 'http://www.w3.org/1999/xhtml'
            }
        }
        const onclick = sinon.spy()
        const test = new Button({ onclick })
        test.node.click()
        it('node.onclick', () => {
            assert.equal(test.node.onclick, onclick)
        })
        it('onclick.calledOnce', () => {
            assert(onclick.calledOnce, 'onclick.calledOnce')
        })
    })
    describe('new TestElement({ textContent })', () => {
        const test = new TestElement({ textContent : 'foobar' })
        it('parent.textContent', () => {
            assert.equal(test.textContent, 'foobar')
        })
        it('serializeToString(node)', () => {
            const xml = serializer.serializeToString(test.node)
            assert.equal(xml, '<element>foobar</element>')
        })
    })
})
