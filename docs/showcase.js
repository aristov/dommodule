import {
    ElementAssembler,
    fragment,
    element,
    text,
    cdata,
    comment,
    instruction
} from '../lib'

const title = function(init) {
    return new ElementAssembler({ qualifiedName : 'title' }, init)
}

const example = function(init) {
    return new ElementAssembler({ qualifiedName : 'example' }, init)
}

instruction({
    parentNode : document,
    target : 'xml-stylesheet',
    data : { href : 'showcase.css' }
})

element({
    qualifiedName : 'document',
    parentNode : document,
    children : [
        fragment([
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
    ]
})
