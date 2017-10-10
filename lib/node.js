import { EventTargetAssembler } from './target'

/**
 * Node DOM interface assembler
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {Node|*} node
     */
    set node(node) {
        this._target = node
    }

    /**
     * @returns {*}
     */
    get node() {
        return this._target
    }
}
