const {
    DocumentAssembler,
    attr, comment, doctype, element,
    fragment, instruction, text
} = dommodule

new DocumentAssembler({
    node : document,
    title : 'dommodule: example',
    childNodes : [
        doctype('example'),
        fragment([
            instruction({
                target : 'xml-stylesheet',
                attrset : { href : './example.css' }
            }),
            element({
                localName : 'example',
                attributes : attr({
                    namespace : 'http://www.w3.org/XML/1998/namespace',
                    name : 'xml:lang',
                    value : 'en'
                }),
                childNodes : [
                    comment(new Date + ' version 1.0.0'),
                    text('Hello world!')
                ]
            })
        ])
    ]
})
