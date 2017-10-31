import { EventTargetAssembler } from './eventtarget'

const { Node } = window

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
     * @param {Function} [assembler]
     * @returns {TargetAssembler|*}
     */
    getInstance(node, assembler) {
        if(node) {
            const constructor = this.constructor
            if(constructor.hasInstance(node)) {
                return constructor.getInstance(node)
            }
            else {
                return assembler?
                    new assembler({ node }) :
                    constructor.getInstance(node)
            }
        }
        return null
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
     * @returns {Function}
     */
    static get interface() {
        return Node
    }
}
