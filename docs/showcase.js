import {
    fragment,
    element,
    text,
    cdata,
    comment,
    instruction
} from '../lib'

const title = function(init) {
    return element({ qualifiedName : 'title' }).init(init)
}

const example = function(init) {
    return element({ qualifiedName : 'example'}).init(init)
}

const assembler = fragment([
    title('XML document'),
    example([
        title('Element'),
        element({
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
            data : 'ProcessingInstruction node'
        })
    ])
])

assembler.parentNode = document.documentElement
