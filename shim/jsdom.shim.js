import { TextAssembler, CommentAssembler, DocumentFragmentAssembler } from '../lib/index'

/*
 * https://github.com/jsdom/jsdom/issues/1641
 */
Object.defineProperty(window.Attr.prototype, 'nodeType', {
    configurable : true,
    enumerable : true,
    get() {
        return window.Node.ATTRIBUTE_NODE
    }
})

/*
 * https://github.com/jsdom/jsdom/issues/2273
 */
TextAssembler.create = function() {
    return window.document.createTextNode(this.data)
}
CommentAssembler.create = function() {
    return window.document.createComment(this.data)
}

/*
 * https://github.com/jsdom/jsdom/issues/2274
 */
DocumentFragmentAssembler.create = function() {
    return window.document.createDocumentFragment()
}
