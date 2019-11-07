import { Assembler } from 'esmodule'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler
const key = Symbol()

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
export class EventTargetAssembler extends Assembler {
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
        const storage = context[key] || (context[key] = { true : {}, false : {} })
        const handlers = storage[Boolean(capture)]
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
        const storage = context[key]
        const map = storage && storage[Boolean(capture)][type]
        if(map && map.has(callback)) {
            delete options.context
            getTargetOf(this).removeEventListener(type, map.get(callback), options)
            map.delete(callback)
        }
    }

    /**
     * @returns {interface} EventTarget
     * @override
     */
    static get interface() {
        return EventTarget
    }
}

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
        if(options === true) {
            return { capture : true }
        }
        if(options instanceof EventTargetAssembler) {
            return { context : options }
        }
        return Object.assign({}, options)
    }
    return {}
}

EventTargetAssembler.register()
