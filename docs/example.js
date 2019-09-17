const {
    AttrAssembler,
    CommentAssembler,
    DocumentAssembler,
    DocumentFragmentAssembler,
    DocumentTypeAssembler,
    ElementAssembler,
    NodeAssembler,
    TextAssembler
} = dommodule

NodeAssembler.debug()

class Example extends ElementAssembler {}

class ExampleDocument extends DocumentAssembler {
    static get elementAssembler() {
        return Example
    }
}

class ExampleDoctype extends DocumentTypeAssembler {
    static get documentAssembler() {
        return ExampleDocument
    }
}

class Lang extends AttrAssembler {
    static get namespace() {
        return 'http://www.w3.org/XML/1998/namespace'
    }
    static get prefix() {
        return 'xml'
    }
}

new ExampleDocument({
    node : document,
    title : 'dommodule: example',
    children : [
        new ExampleDoctype,
        new DocumentFragmentAssembler([
            new CommentAssembler(new Date + ' version 1.0.0'),
            new Example({
                attributes : new Lang('en'),
                children : new TextAssembler('Hello world!')
            })
        ])
    ]
})
