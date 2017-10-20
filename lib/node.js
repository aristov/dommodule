import { EventTargetAssembler } from './eventtarget'
import { Node } from './core'

/**
 * Node DOM interface assembler
 */
export class NodeAssembler extends EventTargetAssembler {
    /**
     * @param {*} init
     * @returns {Node|*}
     */
    assemble(init) {
        if(init && init.node instanceof Node) {
            this.init(init)
        }
        else super.assemble(init)
        return this.node
    }

    /**
     * @param {Node|*} node
     */
    set node(node) {
        this.setInstance(node)
    }

    /**
     * @returns {Node|*}
     */
    get node() {
        return this._target
    }
}
