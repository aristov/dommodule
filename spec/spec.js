import chai from 'chai'
import { ElementAssembler } from '../lib/'

const { assert } = chai
const { Attr, Comment, Document, DocumentType, Element, Text } = window

const assembler = new ElementAssembler
const serializer = new XMLSerializer

describe('ElementAssembler', () => {
    describe('new ElementAssembler', () => {
        const instance = new ElementAssembler
        const node = instance.node
        it('proper inheritance', () => {
            assert(node instanceof Element, node + ' instance of ' + Element)
        })
        it('proper constructor', () => {
            assert.equal(node.constructor, Element)
        })
        it('proper tagName', () => {
            assert.equal(node.tagName, 'element')
        })
        it('proper number of attributes', () => {
            assert(!node.hasAttributes(), 'has no attributes')
        })
        it('serializes properly', () => {
            assert.equal(serializer.serializeToString(node), '<element/>')
        })
    })
    /*describe('init', () => {
        const node = assembler.assemble({ qualifiedName : 'a' })
        assembler.init({
            attributes : { rel : 'external' },
            dataset : { ref : '712-42' },
            style : { color : '#777' },
            children : 'W3C homepage',
            id : 'w3-link',
            href : 'https://www.w3.org',
            ferh : 'gro.3w.www//:sptth',
            '123' : '0987654321',
            className : undefined,
            undef : undefined
        })
        describe('assembler interfaces', () => {
            it('attributes', () => {
                assert.equal(node.getAttribute('rel'), 'external')
                assert.equal(node.rel, 'external')
            })
            it('dataset', () => {
                assert.equal(node.dataset.ref, '712-42')
                assert.equal(node.getAttribute('data-ref'), '712-42')
            })
            it('style', () => {
                assert.equal(node.style.color, 'rgb(119, 119, 119)')
                assert.equal(node.getAttribute('style'), 'color: rgb(119, 119, 119);')
            })
            it('children', () => {
                assert(node.hasChildNodes(), 'has child nodes')
                assert.equal(node.childNodes.length, 1)
                assert.equal(node.innerHTML, 'W3C homepage')
            })
        })
        describe('known properties', () => {
            it('id', () => {
                assert.equal(node.id, 'w3-link')
                assert.equal(node.getAttribute('id'), 'w3-link')
            })
            it('href', () => {
                assert.equal(node.href, 'https://www.w3.org/')
                assert.equal(node.getAttribute('href'), 'https://www.w3.org')
            })
        })
        describe('unknown properties', () => {
            it('ferh', () => {
                assert(!('ferh' in node), 'ignore "ferh" property')
                assert(!node.hasAttribute('ferh'), 'has no "ferh" attribute')
            })
            it('123', () => {
                assert(!('123' in node), 'ignore "123" property')
                assert(!node.hasAttribute('123'), 'has no "123" attribute')
            })
        })
        describe('undefined', () => {
            it('className', () => {
                assert.equal(node.className, '')
                assert(!node.hasAttribute('class'), 'has no "class" attribute')
            })
            it('undef', () => {
                assert(!('undef' in node), 'ignore undefined property')
                assert(!node.hasAttribute('undef'), 'has no "undef" attribute')
            })
        })
    })
    describe('attributes', () => {
        const node = assembler.assemble({ qualifiedName : 'input' })
        assembler.attributes = {
            checked : '',
            disabled : '',
            custom_string : 'string',
            custom_boolean : true,
            custom_number : 123,
            class : undefined,
            custom_undef : undefined,
            custom_null : null
        }
        it('has attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 3)
        })
        it('checked', () => {
            assert.equal(node.checked, true)
            assert.equal(node.getAttribute('checked'), '')
        })
        it('disabled', () => {
            assert.equal(node.disabled, true)
            assert.equal(node.getAttribute('disabled'), '')
        })
        it('custom_string', () => {
            assert.equal(node.getAttribute('custom_string'), 'string')
            assert(!('custom_string' in node), 'has no string property')
        })
        it('custom_boolean', () => {
            assert(!node.hasAttribute('custom_boolean'), 'has no boolean attribute')
            assert(!('custom_boolean' in node), 'has no such property')
        })
        it('custom_number', () => {
            assert(!node.hasAttribute('custom_number'), 'has no number attribute')
            assert(!('custom_number' in node), 'has no number property')
        })
        it('custom_undef', () => {
            assert(!node.hasAttribute('custom_undef'), 'has no undefined attribute')
            assert(!('custom_undef' in node), 'has no undefined property')
        })
        it('class', () => {
            assert(!node.hasAttribute('class'), 'has no class attribute')
            assert.equal(node.className, '')
        })
        it('custom_null', () => {
            assert(!node.hasAttribute('custom_null'), 'has no null attribute')
            assert(!('custom_null' in node), 'has no null property')
        })
    })
    describe('dataset', () => {
        const node = assembler.assemble({ qualifiedName : 'div' })
        assembler.dataset = {
            simple : 'simple data-attribute',
            camelCased : 'camelCased data-attribute'
        }
        it('has attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 2)
        })
        it('simple', () => {
            assert.equal(node.dataset.simple, 'simple data-attribute')
            assert.equal(node.getAttribute('data-simple'), 'simple data-attribute')
        })
        it('camelCased', () => {
            assert.equal(node.dataset.camelCased, 'camelCased data-attribute')
            assert.equal(node.getAttribute('data-camel-cased'), 'camelCased data-attribute')
        })
    })
    describe('style', () => {
        const node = assembler.assemble({ qualifiedName : 'span' })
        assembler.style = {
            color : 'white',
            backgroundColor : 'black'
        }
        it('has attributes', () => {
            assert(node.hasAttributes(), 'has attributes')
            assert.equal(node.attributes.length, 1)
        })
        it('color', () => {
            assert.equal(node.style.color, 'white')
        })
        it('backgroundColor', () => {
            assert.equal(node.style.backgroundColor, 'black')
        })
    })
    describe('children', () => {
        const child = new HTMLElementAssembler
        child.assemble({ qualifiedName : 'span' })
        const node = assembler.assemble({ qualifiedName : 'div' })
        assembler.children = [
            0, // ignored
            document.createElement('button'),
            '', // ignored
            'text node as string',
            NaN, // ignored
            document.createTextNode('created text node'),
            null, // ignored
            document.createElement('a'),
            false, // ignored
            document.createComment('Simple DOM Comment node'),
            undefined, // ignored
            child
        ]
        const childNodes = node.childNodes
        it(`has ${ childNodes.length } child nodes`, () => {
            assert(node.hasChildNodes(), 'has child nodes')
            assert.equal(childNodes.length, 6)
        })
        it('1: button', () => {
            assert.equal(childNodes[0].constructor, HTMLButtonElement)
            assert.equal(childNodes[0].tagName, 'BUTTON')
        })
        it('2: text node as string', () => {
            assert.equal(childNodes[1].constructor, Text)
            assert.equal(childNodes[1].textContent, 'text node as string')
        })
        it('3: created text node', () => {
            assert.equal(childNodes[2].constructor, Text)
            assert.equal(childNodes[2].nodeValue, 'created text node')
        })
        it('4: a', () => {
            assert.equal(childNodes[3].constructor, HTMLAnchorElement)
            assert.equal(childNodes[3].tagName, 'A')
        })
        it('5: comment', () => {
            assert.equal(childNodes[4].constructor, Comment)
            assert.equal(childNodes[4].textContent, 'Simple DOM Comment node')
        })
        it('6: span', () => {
            assert.equal(childNodes[5].constructor, HTMLSpanElement)
            assert.equal(childNodes[5].tagName, 'SPAN')
        })
    })*/
})
