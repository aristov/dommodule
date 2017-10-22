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
        if(init && init.constructor === Object && init.node instanceof Node) {
            this.init(init)
        }
        else super.assemble(init)
        return this.node
    }

    /**
     * @param {Node|*} node
     */
    set node(node) {
        const { domInterface, name } = this.constructor
        if(node instanceof domInterface) this.setInstance(node)
        else {
            const message = `Failed to set 'node' on '${ name }': parameter is not of expected type.`
            throw Error(message)
        }
    }

    /**
     * @returns {Node|*}
     */
    get node() {
        return this._target
    }

    /**
     * @returns {Function}
     */
    static get domInterface() {
        return Node
    }
}
