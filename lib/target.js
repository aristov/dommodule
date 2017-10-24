import { INSTANCE_PROPERTY_NAME } from './config'

export class TargetAssembler {
    /**
     * Create the assembler instance and assemble the specified object
     * Initializes the object by all passed init arguments
     * @param {*} [init]
     */
    constructor(init) {
        this.assemble(init)
    }

    /**
     * Instantiate and initialize the specified object
     * @param {*} [init] initializing dictionary
     * @returns {Object|*}
     */
    assemble(init) {
        this.create(init)
        this.init(init)
        return this._target
    }

    /**
     * Create the specified object
     * @param {*} [init] initializing dictionary
     * @returns {Object|*}
     */
    create(init) {
        const target = this.constructor.create(init)
        this.setInstance(target)
        return target
    }

    /**
     * Initialize the object with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Object|*} initialized node
     */
    init(init) {
        const target = this._target
        if(init && init.constructor === Object) {
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
        target[INSTANCE_PROPERTY_NAME] = this
    }

    /**
     * @param {Object|*} target
     * @returns {TargetAssembler|*}
     */
    getInstance(target) {
        return target? this.constructor.getInstance(target) : null
    }

    /**
     * The init property mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    _onMismatch(prop, value) {
        const propval = prop + `="${ value }"`
        const name = this.constructor.name
        const message = `The property ${ propval } is not found on the ${ name } instance:`
        console.warn(this, message)
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
        return target[INSTANCE_PROPERTY_NAME] || null
    }
}

Object.defineProperty(
    TargetAssembler.prototype,
    '_target',
    {
        writable : true,
        value : null
    })
