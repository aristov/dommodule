const {
    DocumentAssembler,
    attr, comment, doctype,
    element, fragment, text
} = dommodule

document.documentElement.remove()

new DocumentAssembler({
    node : document,
    title : 'dommodule: example',
    childNodes : [
        doctype('example'),
        fragment([
            comment(new Date + ' version 1.0.0'),
            element({
                localName : 'example',
                attributes : attr({
                    namespace : 'http://www.w3.org/XML/1998/namespace',
                    name : 'xml:lang',
                    value : 'en'
                }),
                childNodes : text('Hello world!')
            })
        ])
    ]
})
