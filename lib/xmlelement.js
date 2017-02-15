import { ElementAssembler } from './element'
import { XML_NAMESPACE_URI, XML_NAMESPACE_PREFIX, NAMESPACE_SEPARATOR } from './defaults'

const XML_LANG_ATTRIBUTE_NAME = XML_NAMESPACE_PREFIX + NAMESPACE_SEPARATOR + 'lang'
const XML_SPACE_ATTRIBUTE_NAME = XML_NAMESPACE_PREFIX + NAMESPACE_SEPARATOR + 'space'

export class XMLDOMAssembler extends ElementAssembler {
    set lang(lang) {
        this.node.setAttributeNS(XML_NAMESPACE_URI, XML_LANG_ATTRIBUTE_NAME, lang)
    }
    get lang() {
        return this.node.getAttributeNS(XML_NAMESPACE_URI, XML_LANG_ATTRIBUTE_NAME)
    }
    set space(space) {
        this.node.setAttributeNS(XML_NAMESPACE_URI, XML_SPACE_ATTRIBUTE_NAME, space)
    }
    get space() {
        return this.node.getAttributeNS(XML_NAMESPACE_URI, XML_SPACE_ATTRIBUTE_NAME)
    }
}
