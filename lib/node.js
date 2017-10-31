import { Node } from './dom'
import { EventTargetAssembler } from './eventtarget'

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
            this.node = init.node
            this.init(init)
        }
        else super.assemble(init)
        return this.node
    }

    /**
     * @param {Node|*|null} node
     * @param {NodeAssembler|*} [assembler]
     * @returns {TargetAssembler|*}
     */
    getInstance(node, assembler = this.constructor) {
        return node && assembler.getInstance(node)
    }

    /**
     * @param {Node|*} node
     */
    set node(node) {
        if(node !== this.node) {
            const constructor = this.constructor
            if(node instanceof constructor.interface) this.setInstance(node)
            else {
                const message = `Failed to set 'node' on '${ constructor.name }': parameter is not of expected type.`
                throw TypeError(message)
            }
        }
    }

    /**
     * @returns {Node|*}
     */
    get node() {
        return this._target
    }

    /**
     * @param {Node|*} node
     * @returns {NodeAssembler|*}
     */
    static getInstance(node) {
        return this.hasInstance(node)? super.getInstance(node) : new this({ node })
    }

    /**
     * @returns {Function}
     */
    static get interface() {
        return Node
    }
}
