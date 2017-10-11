import { ASSEMBLER_INSTANCE_PROPERTY_NAME } from './core'

export class TargetAssembler {
    /**
     * Create the assembler instance and assemble the specified object
     * Initializes the object by all passed init arguments
     * @param {*} [init]
     * @param {*} [rest]
     */
    constructor(init, ...rest) {
        this.assemble(init)
        if(rest.length) {
            rest.forEach(init => this.init(init))
        }
    }

    /**
     * Instantiate and initialize the specified object
     * @param {*} [init] initializing dictionary
     * @returns {Object|*}
     */
    assemble(init) {
        const target = this.create(init)
        this.setInstance(target)
        this.init(init)
        return target
    }

    /**
     * Create the specified object
     * @param {*} [init] initializing dictionary
     * @returns {init}
     */
    create(init) {
        return init && init.constructor === Object?
            this.constructor.create(init) :
            this.constructor.create()
    }

    /**
     * Initialize the object with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Object|*} initialized node
     */
    init(init) {
        const target = this._target
        if(init) {
            const constructor = this.constructor
            for(let prop in init) {
                const value = init[prop]
                if(value !== undefined) {
                    if(prop in this) this[prop] = value
                    else if(prop in constructor) void null
                    else if(prop in target) target[prop] = value
                    else this._onMismatch(prop, value)
                }
            }
        }
    }

    /**
     * @param {Object|*} target
     */
    setInstance(target) {
        this._target = target
        target[ASSEMBLER_INSTANCE_PROPERTY_NAME] = this
    }

    /**
     * @param {Object|*} target
     * @returns {TargetAssembler|*}
     */
    getInstance(target) {
        return this.constructor.getInstance(target)
    }

    /**
     * The init mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    _onMismatch(prop, value) {
        const propval = prop + `="${ value }"`
        const name = this.name
        const message = `The property ${ propval } is not found on the ${ name } instance:`
        console.warn(message, this)
    }

    /**
     * Stub for extension
     */
    static create() {
        throw Error(`Could not create an abstract ${ this.name } instance!`)
    }

    /**
     * @param {Object|*} target
     * @returns {TargetAssembler|*|null}
     */
    static getInstance(target) {
        return target[ASSEMBLER_INSTANCE_PROPERTY_NAME] || null
    }
}

Object.defineProperty(
    TargetAssembler.prototype,
    '_target',
    {
        writable : true,
        value : null
    })