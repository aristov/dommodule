import { Assembler } from 'esmodule'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler
const storage = Symbol()

/**
 * @param {{capture,once,passive,context}|boolean|EventTargetAssembler|*} [options]
 * @param {boolean} [options.capture]
 * @param {boolean} [options.once]
 * @param {boolean} [options.passive]
 * @param {EventTargetAssembler} [options.context]
 * @returns {{capture,once,passive,context}}
 * @private
 */
function getOptions(options) {
    if(options) {
        if(typeof options === 'boolean') {
            return { capture : true }
        }
        if(options instanceof EventTargetAssembler) {
            return { context : options }
        }
        return Object.assign({}, options)
    }
    return {}
}

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
export class EventTargetAssembler extends Assembler {
    /**
     * @param {*} [init]
     * @returns {EventTarget|*}
     */
    assemble(init) {
        this[storage] = { true : {}, false : {} }
        return super.assemble(init)
    }

    /**
     * @param {Event|string|*} eventOrType
     * @param {CustomEventInit|{}} [eventInitDict]
     * @param {boolean} [eventInitDict.bubbles]
     * @param {boolean} [eventInitDict.cancelable]
     * @param {*} [eventInitDict.detail]
     * @returns {boolean}
     */
    emit(eventOrType, eventInitDict) {
        if(typeof eventOrType === 'string') {
            eventOrType = new CustomEvent(eventOrType, eventInitDict)
        }
        return getTargetOf(this).dispatchEvent(eventOrType)
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {{capture,once,passive,context}|boolean|EventTargetAssembler|*} [options]
     * @param {boolean} [options.capture]
     * @param {boolean} [options.once]
     * @param {boolean} [options.passive]
     * @param {EventTargetAssembler} [options.context]
     */
    on(type, callback, options) {
        const { context = this, capture } = options = getOptions(options)
        const handlers = context[storage][Boolean(capture)]
        const map = handlers[type] || (handlers[type] = new Map)
        if(!map.has(callback)) {
            delete options.context
            map.set(callback, callback = callback.bind(context))
            getTargetOf(this).addEventListener(type, callback, options)
        }
    }

    /**
     * @param {string} type
     * @param {function} callback
     * @param {{capture,context}|boolean|EventTargetAssembler|*} [options]
     * @param {boolean} [options.capture]
     * @param {EventTargetAssembler} [options.context]
     */
    un(type, callback, options) {
        const { context = this, capture } = options = getOptions(options)
        const map = context[storage][Boolean(capture)][type]
        if(map && map.has(callback)) {
            delete options.context
            getTargetOf(this).removeEventListener(type, map.get(callback), options)
            map.delete(callback)
        }
    }

    /**
     * @returns {EventTarget}
     * @override
     */
    static create() {
        return new EventTarget
    }

    /**
     * @returns {interface} EventTarget
     * @override
     */
    static get interface() {
        return EventTarget
    }
}
