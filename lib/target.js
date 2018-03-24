import { INSTANCE_PROPERTY_NAME, TYPE_UNDEFINED } from './const'

let undefined
const INIT_PROPERTY_NAME = 'init'
const TARGET_PROPERTY_NAME = '_target'

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
     */
    create(init) {
        this.setInstanceOf(this.constructor.create(init))
    }

    /**
     * @param {Object|*} target
     */
    setInstanceOf(target) {
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
     * @param {{}} init
     */
    assign(init) {
        for(let prop in init) {
            if(init.hasOwnProperty(prop)) {
                this.setProperty(prop, init[prop])
            }
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
            else this.onPropertyMismatch(name)
        }
    }

    /**
     * The init property mismatch handler
     * @param {String} prop mismatched property name
     */
    onPropertyMismatch(prop) {
        const name = this.constructor.name
        console.warn(`The property "${ prop }" is not found on the ${ name } instance`)
    }

    /**
     * @param {{}} [init]
     * @returns {Object}
     */
    static create(init) {
        const { properties } = init || this
        return Object.create(this.interface.prototype, properties)
    }

    /**
     * @param {TargetAssembler|Object|*} target
     * @returns {TargetAssembler|*|null}
     */
    static getInstanceOf(target) {
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

    /**
     * @returns {ObjectConstructor}
     */
    static get interface() {
        return Object 
    }

    /**
     * @returns {undefined}
     */
    static get properties() {
        return undefined
    }
}

Object.defineProperty(
    TargetAssembler.prototype,
    TARGET_PROPERTY_NAME,
    { writable : true, value : null })
