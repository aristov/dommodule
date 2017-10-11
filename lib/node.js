import { EventTargetAssembler } from './eventtarget'

/**
 * Node DOM interface assembler
 */
export class NodeAssembler extends EventTargetAssembler {
    assemble(init) {
        if(init && init.node) this.init(init)
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
     * @returns {*}
     */
    get node() {
        return this._target
    }
}
