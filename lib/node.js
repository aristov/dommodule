import { EventTargetAssembler } from './eventtarget'

/**
 * Node DOM interface assembler
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {Node|*} node
     */
    set node(node) {
        this.setInstance(node)
    }

    /**
     * @returns {*}
     */
    get node() {
        return this._target
    }

    static get document() {
        return document
    }
}
