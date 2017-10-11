{
    const dommodule = window.dommodule

    const {
        attr,
        cdata,
        comment,
        doctype,
        document,
        element,
        fragment,
        instruction,
        text,
    } = dommodule

    element({
        parentNode : document.documentElement,
        attributes : [
            attr(),
            attr({}),
            attr({ namespaceURI : 'http://www.w3.org/1999/xhtml' }),
            attr({ name : 'testname' }),
            attr({ name : 'testname', value : 'testvalue' }),
            attr({
                namespaceURI : 'http://www.example.com/namespace',
                name : 'ns-example',
                value : 'ns-example-value'
            })
        ],
        childNodes : [
            cdata('CDATASection node'),
            comment('Comment node'),
            instruction('PI node'),
            text('Text node')
        ]
    })
}
