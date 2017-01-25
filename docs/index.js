import {
    fragment,
    xmlelement as element,
    text,
    cdata,
    comment,
    instruction
} from '../lib'

const title = function(init) {
    return element('title', init)
}

const example = function(init) {
    return element('example', init)
}

const assembler = fragment([
    title('XML document'),
    example([
        title('Element'),
        element('element', {
            id : 'e0000002',
            className : 'sample',
            attributes : { key : 'value' },
            children : 'Element node'
        })
    ]),
    example([
        title('Text'),
        text('Text node')
    ]),
    example([
        title('CDATA section'),
        cdata('CDATA section node')
    ]),
    example([
        title('Comment'),
        comment('Comment node')
    ]),
    example([
        title('Processing instruction'),
        instruction({
            target : 'example',
            data : 'type="test"'
        })
    ])
])

assembler.parentNode = document.documentElement

console.log(document.documentElement.outerHTML)
