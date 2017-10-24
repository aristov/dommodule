const { prototype : { forEach, map } } = Array

const EMPTY_STRING = ''

const ELEMENT_NODE = 1
const TEXT_NODE = 3
const CDATA_SECTION_NODE = 4
const PROCESSING_INSTRUCTION_NODE = 7
const COMMENT_NODE = 8
const DOCUMENT_NODE = 9
const DOCUMENT_TYPE_NODE = 10

class XMLSerializer {
    serializeToString(node) {
        switch(node.nodeType) {
            case ELEMENT_NODE:
                const { tagName, namespaceURI } = node
                let attrs = EMPTY_STRING
                let childs = '/'
                if(node.hasAttributes()) {
                    forEach.call(node.attributes, ({ name, value }) => {
                        attrs += ` ${ name }="${ value }"`
                    })
                }
                if(namespaceURI) {
                    attrs += ' xmlns'
                    if(node.prefix) attrs += ':' + node.prefix
                    attrs += `="${ namespaceURI }"`
                }
                if(node.hasChildNodes()) {
                    childs = '>'
                    forEach.call(node.childNodes, child => {
                        childs += this.serializeToString(child)
                    })
                    childs += '</' + tagName
                }
                return `<${ tagName + attrs + childs }>`
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
                let pub = EMPTY_STRING
                let sys = EMPTY_STRING
                if(node.publicId) {
                    pub = ` PUBLIC "${ node.publicId }"`
                }
                if(node.systemId) {
                    sys = node.publicId? ' ' : ' SYSTEM '
                    sys += `"${ node.systemId }"`
                }
                return `<!DOCTYPE ${ node.name + pub + sys }>`
        }
    }
}

module.exports = XMLSerializer
