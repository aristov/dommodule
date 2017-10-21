import { DocumentTypeAssembler } from '../lib/doctype'

class Html extends DocumentTypeAssembler {
    static get qualifiedName() {
        return 'html'
    }
}

const a = new Html({
    publicId : '-//W3C//DTD XHTML 1.1//EN',
    systemId : 'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd'
})

const serializer = new XMLSerializer

console.log(serializer.serializeToString(a.node))
