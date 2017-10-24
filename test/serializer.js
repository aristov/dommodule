const { prototype : { forEach, map } } = Array

module.exports = class XMLSerializer {
    serializeToString(node) {
        switch(node.nodeType) {
            case 1:
                let attrs = ''
                let childs = '/'
                if(node.hasAttributes()) {
                    forEach.call(node.attributes, attr => {
                        attrs += ` ${ attr.name }="${ attr.value }"`
                    })
                }
                if(node.namespaceURI) {
                    const prefix = node.prefix? ':' + node.prefix : ''
                    attrs += ` xmlns${ prefix }="${ node.namespaceURI }"`
                }
                if(node.hasChildNodes()) {
                    childs = '>'
                    forEach.call(node.childNodes, child => {
                        childs += this.serializeToString(child)
                    })
                    childs += '</' + node.tagName
                }
                return `<${ node.tagName + attrs + childs }>`
            case 3:
                return node.data
            case 7:
                return `<?${ node.target } ${ node.data }?>`
            case 8:
                return `<!--${ node.data }-->`
            case 9:
                if(!node.hasChildNodes()) return ''
                return map.call(node.childNodes, child => {
                    return this.serializeToString(child)
                }).join('')
            case 10:
                let pub = ''
                let sys = ''
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
