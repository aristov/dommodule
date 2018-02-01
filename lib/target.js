import { INSTANCE_PROPERTY_NAME, TYPE_UNDEFINED } from './const'

const INIT_PROPERTY_NAME = 'init'

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
     * @param {Object|*} target
     */
    setInstance(target) {
        this._target = target
        target[INSTANCE_PROPERTY_NAME] = this
    }

    /**
     * Initialize the object with the defined properties
     * @param {*} [init] initializing dictionary
     * @returns {Boolean}
     */
    init(init) {
        if(init && init.constructor === Object) {
            this.assign(init)
        }
        else if(typeof init !== TYPE_UNDEFINED) {
            this.assign({ [this.constructor.initPropertyName] : init })
        }
        else this.assign({})
    }

    /**
     * @param {*} init
     */
    assign(init) {
        for(let prop in init) {
            this.setProperty(prop, init[prop])
        }
    }

    /**
     * @param {String} name
     * @param {String} value
     */
    setProperty(name, value) {
        if(value !== undefined) {
            if(name in this.constructor) void null
            else if(name in this) {
                this[name] = value
            }
            else if(name in this._target) {
                this._target[name] = value
            }
            else this._onMismatch(name, value)
        }
    }

    /**
     * The init property mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    _onMismatch(prop, value) {
        const propval = prop + `="${ value }"`
        const name = this.constructor.name
        const message = `The property ${ propval } is not found on the ${ name } instance`
        console.warn(this, message)
    }

    /**
     * Stub for extension
     * @abstract
     */
    static create() {
        throw Error(`Could not create an abstract ${ this.name } instance`)
    }

    /**
     * @param {Object|*} target
     * @returns {Boolean}
     */
    static hasInstance(target) {
        return target.hasOwnProperty(INSTANCE_PROPERTY_NAME)
    }

    /**
     * @param {TargetAssembler|Object|*} target
     * @returns {TargetAssembler|*|null}
     */
    static getInstance(target) {
        return target instanceof TargetAssembler?
            target :
            target[INSTANCE_PROPERTY_NAME]
    }

    /**
     * @returns {String}
     */
    static get initPropertyName() {
        return INIT_PROPERTY_NAME
    }
}

Object.defineProperty(
    TargetAssembler.prototype,
    '_target', {
        writable : true,
        value : null
    })
