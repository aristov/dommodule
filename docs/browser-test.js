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
                attrset : { href : './browser-test.css' }
            }),
            element({
                localName : 'example',
                attributes : attr({
                    name : 'role',
                    value : 'application'
                }),
                childNodes : [
                    comment(new Date + ' version 1.0.0'),
                    text('Hello world!')
                ]
            })
        ])
    ]
})
