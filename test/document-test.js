import {
    DocumentAssembler,
    attr, comment, doctype,
    element, fragment,
    instruction, text
} from '../lib'

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
                    name : 'role',
                    value : 'application'
                }),
                childNodes : [
                    comment('Version 1.0.0'),
                    text('Hello world!')
                ]
            })
        ])
    ]
})

// <!DOCTYPE example-doctype>
// <?xml-stylesheet href="./test.css"?>
// <element role="application">
//      <!--Version 1.0.0-->
//      Hello world!
// </element>


/*instruction({
    target : 'xml-stylesheet',
    attrset : { href : './test.css' },
    parentNode : new DocumentAssembler({
        node : document,
        doctype : doctype('dom-application'),
        documentElement : element({
            attributes : [
                attr({ name : 'role', value : 'application' })
            ],
            children : fragment([
                comment('Example dommodule application / version 1.0.0'),
                text('Hello world!')
            ])
        })
    })
})*/
