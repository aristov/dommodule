export class EventTargetAssembler {
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
     * @param init initializing dictionary
     * @returns {Node|*}
     */
    assemble(init) {
        this.instantiate(init)
        return this.init(init)
    }

    /**
     * Instantiate the specified node
     * @param {*} init initializing dictionary
     * @returns {Node|*} instantiated node
     */
    instantiate(init) {
        if('target' in init) {
            this.target = init.target
            delete init.target
        }
        return this.target
    }

    /**
     * Initialize the node with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Node|*} initialized node
     */
    init(init) {
        const target = this.target
        for(let prop in init) {
            const value = init[prop]
            if(value !== undefined) {
                if(prop in this) this[prop] = value
                else if(prop in target) target[prop] = value
                else this.onmismatch(prop, value)
            }
        }
        return target
    }

    /**
     * The init mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    onmismatch(prop, value) {
        mismatchWarn(prop, value, this.constructor.name)
    }
}

Object.defineProperty(EventTargetAssembler.prototype, 'target', { writable : true, value : null })

/**
 * Send the console warning on the init mismatch
 * @param {String} prop
 * @param {String} value
 * @param {String} name
 */
function mismatchWarn(prop, value, name) {
    const propval = [prop, `"${ value }"`].join('=')
    console.warn(`The property ${ propval } is not found on the ${ name } instance!`)
}
