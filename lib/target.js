export class EventTargetAssembler {
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
     * @returns {EventTarget|*}
     */
    assemble(init) {
        const constructor = this.constructor
        this._target = init && init.constructor === Object?
            constructor.create(init) :
            constructor.create()
        this.init(init)
        return this._target
    }

    /**
     * Initialize the object with the defined properties
     * @param {*} init initializing dictionary
     * @returns {Node|*} initialized node
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
     * @param {String} eventType
     * @param {CustomEventInit|{}} [eventInit]
     */
    emit(eventType, eventInit) {
        const event = new CustomEvent(eventType, eventInit)
        this._target.dispatchEvent(event)
    }


    /**
     * @param {String} type
     * @param {Function} callback
     * @param {Object} [capture]
     * @returns {EventTargetAssembler}
     */
    on(type, callback, capture = false) {
        this._target.addEventListener(type, callback, capture)
        return this
    }
    
    /**
     * @param {String} type
     * @param {Function} callback
     * @param {Boolean} [capture]
     * @returns {EventTargetAssembler}
     */
    un(type, callback, capture = false) {
        this._target.removeEventListener(type, callback, capture)
        return this
    }

    /**
     * The init mismatch handler
     * @param {String} prop mismatched property name
     * @param {*} value mismatched property value
     */
    _onMismatch(prop, value) {
        if(consoleExists) {
            const propval = prop + `="${ value }"`
            const name = this.name
            const message = `The property ${ propval } is not found on the ${ name } instance:`
            console.warn(message, this)
        }
    }

    /**
     * Stub for extension
     */
    static create() {
        throw Error(`Could not create an abstract ${ this.name } instance!`)
    }
}

const consoleExists = typeof console !== 'undefined'

Object.defineProperty(
    EventTargetAssembler.prototype,
    '_target',
    {
        writable : true,
        value : null
    })
