{
    const dommodule = window.dommodule

    const {
        attr, cdata, comment,
        doctype, document, element,
        fragment, instruction,
        range, text, xml,
    } = dommodule

    console.log(attr())
    console.log(attr({}))
    console.log(attr({ namespaceURI : 'http://www.w3.org/1999/xhtml' }))
    console.log(attr({ name : 'testname' }))
    console.log(attr({ name : 'testname', value : 'testvalue' }))
    console.log(attr({
        namespaceURI : 'http://www.example.com/namespace',
        name : 'ns-example',
        value : 'ns-example-value'
    }))
    console.log(range({}))
}
