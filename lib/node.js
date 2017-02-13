const hostDocument = window.document

/**
 * Node DOM iterface assembler
 */
export class NodeAssembler {
    /**
     * Create the assembler instance and
     * assemble the specified node if the init is passed
     * @param {*} [init]
     */
    constructor(init) {
        if(init) this.assemble(init)
    }

    /**
     * Instantiate and initialize the specified node
     * @param {*} [init] initializing dictionary
     * @returns {Node|*}
     */
    assemble(init) {
        if(init instanceof Node) this.node = init
        else {
            this.node = this.constructor.create(init)
            if(init) this.init(init)
        }
        return this.node
    }

    /**
     * Initialize the node with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Node|*} initialized node
     */
    init(init) {
        const { node, constructor } = this
        for(let prop in init) {
            const value = init[prop]
            if(value !== undefined) {
                if(prop in this) this[prop] = value
                else if(prop in constructor) void null
                else if(prop in node) node[prop] = value
                else this.onmismatch(prop, value)
            }
        }
        return node
    }

    /**
     * The init mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    onmismatch(prop, value) {
        this.constructor.propertyMismatchWarn(prop, value)
    }

    /**
     * Stub for extension
     * @param {*} init
     * @returns {Node} init
     */
    static create(init) {
        throw Error('Could not create the Node instance!')
    }

    /**
     * Send the console warning on the initialization property mismatch
     * @param {String} prop
     * @param {String} value
     */
    static propertyMismatchWarn(prop, value) {
        const propval = [prop, `"${ value }"`].join('=')
        const name = this.name
        if('console' in window) {
            console.warn(`The property ${ propval } is not found on the ${ name } instance!`)
        }
    }

    /**
     *
     * @returns {Document}
     */
    static get document() {
        return hostDocument
    }
}

Object.defineProperty(NodeAssembler.prototype, 'node', { writable : true, value : null })
