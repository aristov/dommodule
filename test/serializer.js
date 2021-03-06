const { prototype : { forEach, map } } = Array

const EMPTY_STRING = ''

const ELEMENT_NODE = 1
const TEXT_NODE = 3
const CDATA_SECTION_NODE = 4
const PROCESSING_INSTRUCTION_NODE = 7
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_TYPE_NODE = 10
const XML_NAMESPACE_URI = 'http://www.w3.org/XML/1998/namespace'

class XMLSerializer {
    serializeToString(node) {
        switch(node.nodeType) {
            case ELEMENT_NODE:
                let xmlns = EMPTY_STRING
                let attributes = EMPTY_STRING
                let childNodes = '/'
                const { namespaceURI } = node
                if(namespaceURI && namespaceURI !== XML_NAMESPACE_URI) {
                    xmlns += ' xmlns'
                    if(node.prefix) xmlns += ':' + node.prefix
                    xmlns += `="${ namespaceURI }"`
                }
                if(node.hasAttributes()) {
                    forEach.call(node.attributes, attr => {
                        const { namespaceURI, prefix, name, value } = attr
                        attributes += ` ${ name }="${ value }"`
                        if(namespaceURI && namespaceURI !== XML_NAMESPACE_URI) {
                            xmlns += ' xmlns'
                            if(prefix) xmlns += ':' + prefix
                            xmlns += `="${ namespaceURI }"`
                        }
                    })
                }
                if(node.hasChildNodes()) {
                    childNodes = '>'
                    forEach.call(node.childNodes, child => {
                        childNodes += this.serializeToString(child)
                    })
                    childNodes += '</' + node.tagName
                }
                return `<${ node.tagName + xmlns + attributes + childNodes }>`
            case TEXT_NODE:
                return node.data
            case CDATA_SECTION_NODE:
                return `<![CDATA[${ node.data }]]>`
            case PROCESSING_INSTRUCTION_NODE:
                return `<?${ node.target } ${ node.data }?>`
            case COMMENT_NODE:
                return `<!--${ node.data }-->`
            case DOCUMENT_NODE:
                if(node.hasChildNodes()) {
                    const handler = child => this.serializeToString(child)
                    return map.call(node.childNodes, handler).join(EMPTY_STRING)
                }
                else return EMPTY_STRING
            case DOCUMENT_TYPE_NODE:
                let publicId = EMPTY_STRING
                let systemId = EMPTY_STRING
                if(node.publicId) {
                    publicId = ` PUBLIC "${ node.publicId }"`
                }
                if(node.systemId) {
                    systemId = node.publicId? ' ' : ' SYSTEM '
                    systemId += `"${ node.systemId }"`
                }
                return `<!DOCTYPE ${ node.name + publicId + systemId }>`
        }
    }
}

module.exports = XMLSerializer
