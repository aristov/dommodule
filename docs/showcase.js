import {
    fragment,
    element,
    text,
    comment,
    instruction
} from '../lib'

const assign = Object.assign

const title = function(init) {
    return element(assign({ localName : 'title' }, init))
}

const example = function(init) {
    return element(assign({ localName : 'example' }, init))
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
                title('Comment'),
                comment('Comment node')
            ]),
            example([
                title('Processing instruction'),
                instruction({
                    target : 'example',
                    data : {
                        href : 'http://localhost:8080',
                        title : 'localhost'
                    }
                })
            ])
        ])
    ]
})
