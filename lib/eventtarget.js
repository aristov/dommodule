import { Assembler } from 'esmodule'

const { CustomEvent, EventTarget } = window
const { getTargetOf } = Assembler

/**
 * @param {{capture,once,passive,context}|boolean|EventTargetAssembler|*} [options]
 * @returns {{capture,once,passive,context}}
 * @private
 */
function getOptions(options) {
    const _options = {}
    if(options) {
        if(typeof options === 'boolean') {
            _options.capture = true
        }
        else if(options instanceof EventTargetAssembler) {
            _options.context = options
        }
        else Object.assign(_options, options)
    }
    return _options
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
        Object.defineProperty(this, '__event_handlers__', {
            value : { true : {}, false : {} }
        })
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
     */
    on(type, callback, options) {
        const { context = this, capture } = options = getOptions(options)
        const handlers = context.__event_handlers__[Boolean(capture)]
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
     */
    un(type, callback, options) {
        const { context = this, capture } = options = getOptions(options)
        const map = context.__event_handlers__[Boolean(capture)][type]
        if(map) {
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
